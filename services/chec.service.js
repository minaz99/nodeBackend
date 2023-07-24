const trialService = {
  def: (req, res) => {
    res.json("Hello there");
  },
  contract: (req, res) => {
    res.json("Authorized");
  },
};
module.exports = trialService;
