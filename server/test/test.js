let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);

// db connection
const client = require("../database/connection");

let should = chai.should();
let app = require("../index");

describe("Tests", () => {
  before("connect", function () {
    client.connect(); // connect to psql
  });

  describe("Get /getUrlDatas", () => {
    it("it should get all the original url to shortened url values", (done) => {
      chai
        .request(app)
        .get("/getUrlDatas")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          done();
        });
    });
  });

  describe("Post /urlShorten", () => {
    it("it should post correctly", (done) => {
      let originalUrl = {
        url: "https://blog.gds-gov.tech/terragrunt-in-retro-i-would-have-done-these-few-things-e5aaac451942",
      };

      chai
        .request(app)
        .post("/urlShorten")
        .send(originalUrl)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("originalUrl");
          res.body.should.have.property("shortenedUrl");
          done();
        });
    });
  });

  describe("Post /urlShorten", () => {
    it("it should post wrongly due to incorrect input", (done) => {
      let originalUrl = {
        url: "this is not a link",
      };

      chai
        .request(app)
        .post("/urlShorten")
        .send(originalUrl)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          done();
        });
    });
  });
});
