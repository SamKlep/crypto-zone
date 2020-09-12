const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const request = require("request");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

function call_api(finishedAPI) {
  request(
    "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=407ce028abe941a672ad85f05150bc2b5794946edb2240e32d61e2e64f57d21e",
    { json: true },
    (err, res, body) => {
      if (err) {
        return console.log(err);
      }

      if (res.statusCode === 200) {
        // console.log(body);
        finishedAPI(body);
      }
    }
  );
}
function get_price(finishedPriceAPI) {
  request(
    "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP,BCH,EOS,LTC,XLM,ADA,USDT,MIOTA,TRX&tsyms=USD&api_key=407ce028abe941a672ad85f05150bc2b5794946edb2240e32d61e2e64f57d21e",
    { json: true },
    (err, res, body) => {
      if (err) {
        return console.log(err);
      }

      if (res.statusCode === 200) {
        console.log(body);
        finishedPriceAPI(body);
      }
    }
  );
}

// Set Handlebars Middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Set handlebar index GET routes
app.get("/", function (req, res) {
  call_api(function (doneAPI) {
    res.render("home", {
      news: doneAPI,
    });
  });
});

// Set handlebar index GET routes
app.get("/prices", function (req, res) {
  get_price(function (donePriceAPI) {
    res.render("prices", {
      price: donePriceAPI,
    });
  });
});

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log(`Server Listening on port ${PORT}`));
