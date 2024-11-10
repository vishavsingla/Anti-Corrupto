const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json"); // Import the generated Swagger JSON file

// Import routers
const authRouter = require("./routers/auth/authRouter");
const vehicleRouter = require("./routers/vehicle/vehicleRouter");
const challanRouter = require("./routers/vehicle/challanRouter");
const insuranceRouter = require("./routers/vehicle/insuranceRouter");
const repairRouter = require("./routers/vehicle/repairRouter");
const landRouter = require("./routers/land/landRouter");
const landInquiryRouter = require("./routers/land/landInquiryRouter");
const transferlandRouter = require("./routers/land/transferlandRouter");
const landcase = require("./routers/land/landcaseRouter");

const app = express();
dotenv.config();

// const corsOptions = {
//   origin: [process.env.FRONTEND_BASE_URL],
//   credentials: true,
//   optionSuccessStatus: 200,
// };

const corsOptions = {
  origin: ["https://anticorrupto.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

// Swagger UI route to serve the generated documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);
app.use("/vehicle", vehicleRouter);
app.use("/challan", challanRouter);
app.use("/", insuranceRouter);
app.use("/", repairRouter);
app.use("/land", landRouter);
app.use("/transferland", transferlandRouter);
app.use("/case", landcase);
app.use("/inquiry", landInquiryRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
