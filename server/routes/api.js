const express = require("express");
const router = express.Router();

// shorten link
const { nanoid } = require("nanoid");
const validUrl = require("valid-url");
const localUrl = process.env.ROOT_URL || "http://localhost:3001";

// db connection
const pg = require("pg");
const conn = require("../database/dbConfig");
const client = new pg.Client(conn.connection);
client.connect(); // connect to psql

router.get("/", (req, res) => {
  return res.send("Welcome to URL Shortener!");
});

/**
 * Get back an array of all url & shortened_url
 */
router.get("/getUrlDatas", (req, res) => {
  client.query("SELECT * FROM public.urls_table", (err, dbResult) => {
    if (err) {
      return res.status(400).send({ error: err });
    } else {
      return res.status(200).send(dbResult.rows);
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
      `insert into public.urls_table(originalUrl, shortUrl) values('${originalUrl}', '${shortenedUrl}');`,
      (err, dbResult) => {
        if (!err) {
          return res.send({
            originalUrl: originalUrl,
            shortenedUrl: shortenedUrl,
          });
        } else {
          // check if originalUrl key is already in the table
          client.query(
            `select shortUrl from public.urls_table where (originalUrl = '${originalUrl}');`,
            (pkErr, pkRes) => {
              if (pkErr) {
                return res.status(400).send({
                  error: pkErr,
                  message: "An error encountered.",
                });
              } else {
                if (pkRes.rows.length == 1) {
                  // retrieve available shortened URL
                  shortenedUrl = pkRes.rows[0];

                  return res.send({
                    originalUrl: originalUrl,
                    shortenedUrl: shortenedUrl.shorturl,
                  });
                } else {
                  // original URL does not exist -> error might be due to shortenedUrl -> collision

                  var foundUnique = false;
                  var maxLoops = 0; // only allow 5 loops to prevent infinite looping -> if exceeded -> try again

                  while (!foundUnique && maxLoops < 5) {
                    maxLoops++;
                    shortenedUrl = localUrl + "/" + nanoid(10); //generate new

                    client.query(
                      `insert into public.urls_table(originalUrl, shortUrl) values('${originalUrl}', '${shortenedUrl}');`,
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
                    return res.status(400).send({
                      error: "Error",
                      message:
                        "Error inserting to database. Please try again later.",
                    });
                  }
                }
              }
            }
          );
        }
        client.end;
      }
    );
  } else {
    return res.status(400).send({
      error: "URL is not valid.",
      message: "URL is not valid: " + originalUrl,
    });
  }
});

router.get("/:key", (req, res) => {
  shortenedUrlKey = req.params.key;
  shortenedUrl = localUrl + "/" + shortenedUrlKey;

  client.query(
    `select originalUrl from public.urls_table where (shortUrl = '${shortenedUrl}');`,
    (err, dbResult) => {
      if (err) {
        res.status(400).send({ error: err });
      } else {
        if (dbResult.rows.length == 0) {
          res.status(400).send({
            error: "Shortened URL not found: " + shortenedUrl,
            message: "Go and regenerate another url!",
          });
        } else {
          res.redirect(dbResult.rows[0].originalurl);
        }
      }

      client.end;
    }
  );
});

/**
 * Delete given a key
 */
router.delete("/delete/:key", (req, res) => {
  shortenedUrlKey = req.params.key;
  shortenedUrl = localUrl + "/" + shortenedUrlKey;
  console.log(shortenedUrl);

  client.query(
    `delete from public.urls_table where shortUrl = '${shortenedUrl}';`,
    (err, dbResult) => {
      if (err) {
        res.status(400).send({ error: err });
      } else {
        res.status(200).send({ success: "Deleted." });
      }

      client.end;
    }
  );
});

module.exports = router;
