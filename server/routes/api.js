const express = require("express");
const router = express.Router();

// shorten link
const { nanoid } = require("nanoid");
const validUrl = require("valid-url");
const localUrl = "http://localhost:3001";

// db connection
const client = require("../database/connection");
client.connect(); // connect to psql

/**
 * Get back an array of all url&shortened_url
 */
router.get("/getUrlDatas", (req, res) => {
  client.query("SELECT * FROM public.url_table", (err, dbResult) => {
    if (err) {
      return res.send({ error: err });
    } else {
      return res.send(dbResult.rows);
    }
    client.end;
  });
});

/**
 * Received a url, generates a shortened url, store in db and return this shortenerd url
 */
router.post("/urlShorten", (req, res) => {
  /*
    expects data in json format:
    {
        "url": "https://blog.gds-gov.tech/terragrunt-in-retro-i-would-have-done-these-few-things-e5aaac451942"
    }
    */

  const originalUrl = req.body.url;
  if (validUrl.isUri(originalUrl)) {
    var shortenedUrl = localUrl + "/" + nanoid(10);

    // insert into database
    client.query(
      `insert into public.url_table(originalUrl, shortUrl) values('${originalUrl}', '${shortenedUrl}');`,
      (err, dbResult) => {
        if (err) {
          // check if originalUrl key is already in the table
          client.query(
            `select shortUrl from public.url_table where (originalUrl = '${originalUrl}');`,
            (pkErr, pkRes) => {
              if (pkErr) {
                return res.send({
                  error: pkErr,
                });
              } else {
                if (pkRes.rows.length == 1) {
                  shortenedUrl = pkRes.rows[0];

                  return res.send({
                    originalUrl: originalUrl,
                    shortenedUrl: shortenedUrl.shorturl,
                  });
                } else {
                  // original URL does not exist -> error might be due to shortenedUrl -> collision
                  var foundUnique = false;
                  var maxLoops = 0; // only allow 5 loops to prevent infinite looping

                  while (foundUnique && maxLoops < 5) {
                    maxLoops++;
                    shortenedUrl = localUrl + "/" + nanoid(10); //generate new

                    client.query(
                      `insert into public.url_table(originalUrl, shortUrl) values('${originalUrl}', '${shortenedUrl}');`,
                      (loopErr, newRes) => {
                        if (!loopErr) {
                          foundUnique = true;
                          return res.send({
                            originalUrl: originalUrl,
                            shortenedUrl: shortenedUrl,
                          });
                        }
                      }
                    );

                    client.end;
                  }

                  if (!foundUnique) {
                    return res.send({
                      error:
                        "Error inserting to database. Please try again later.",
                    });
                  }
                }
              }
            }
          );
        } else {
          return res.send({
            originalUrl: originalUrl,
            shortenedUrl: shortenedUrl,
          });
        }
        client.end;
      }
    );
  } else {
    return res.send({ error: "url is not valid: " + originalUrl });
  }
});

router.get("/:key", (req, res) => {
  shortenedUrlKey = req.params.key;
  shortenedUrl = localUrl + "/" + shortenedUrlKey;

  client.query(
    `select originalUrl from public.url_table where (shortUrl = '${shortenedUrl}');`,
    (err, dbResult) => {
      if (err) {
        res.send({ error: err });
      } else {
        if (dbResult.rows.length == 0) {
          res.send({ error: "url is not valid: " + shortenedUrl });
        } else {
          res.redirect(dbResult.rows[0].originalurl);
        }
      }

      client.end;
    }
  );
});

module.exports = router;
