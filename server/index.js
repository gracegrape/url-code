const express = require("express");
const app = express();
app.use(express.json()); //receive info in json format
const { nanoid } = require("nanoid");

const validUrl = require("valid-url");
const localUrl = "http:localhost:3001";

const client = require("./database/connection");
client.connect(); // connect to psql

app.listen(3001, function () {
  console.log("Listening on Port 3001");
});

app.get("/", function (req, res) {
  res.send("Hello hello, welcome to URL Shortener");
});

/**
 * Get back an array of all url&shortened_url
 */
app.get("/getUrlDatas", (req, res) => {
  client.query("SELECT * FROM public.url_table", (err, dbResult) => {
    if (err) {
      res.send(err);
    } else {
      res.send(dbResult.rows);
    }
    client.end;
  });
});

/**
 * Received a url, generates a shortened url, store in db and return this shortenerd url
 */
app.post("/urlShorten", (req, res) => {
  /*
  expects data in json format:
  {
      "url": "https://blog.gds-gov.tech/terragrunt-in-retro-i-would-have-done-these-few-things-e5aaac451942"
  }
  */

  const originalUrl = req.body.url;

  if (validUrl.isUri(originalUrl)) {
    var shortenedUrl = localUrl + "/" + nanoid();

    // insert into database
    client.query(
      `insert into public.url_table(originalUrl, shortUrl) values('${originalUrl}', '${shortenedUrl}');`,
      (err, dbResult) => {
        if (err) {
          // check if key is already in the table
          client.query(
            `select shortUrl from public.url_table where (originalUrl = '${originalUrl}');`,
            (pkErr, pkRes) => {
              if (pkErr) {
                res.send({
                  error: pkErr,
                });
              } else {
                // found
                shortenedUrl = pkRes.rows[0];

                res.send({
                  originalUrl: originalUrl,
                  shortenedUrl: shortenedUrl.shorturl,
                });
              }
            }
          );
        } else {
          console.log("Url added");

          // send results
          res.send({
            originalUrl: originalUrl,
            shortenedUrl: shortenedUrl,
          });
        }
        client.end;
      }
    );
  } else {
    res.send({ error: "url is not valid: " + originalUrl });
  }
});
