export const textData = async (req, res) => {
  const { product_name, language } = req.body;

  try {
    res.json({ massage: "I Got Data. Data are" + product_name + language });
  } catch (e) {
    res.status(500).json({ massage: e });
  }
};
