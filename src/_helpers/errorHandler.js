function errorHandler(err, req, res, next) {
  if (typeof err === "string") {
    // custom application error
    return res.status(422).json({ success: false, message: err });
  }

  // default to 500 server error
  return res.status(500).json({ success: false, message: err.message });
}

module.exports = errorHandler;
