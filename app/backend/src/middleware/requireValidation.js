export const requireFields = (fields) => (req, res, next) => {
  for (const f of fields) {
    if (!req.body[f]) return res.status(400).json({ message: `${f} is required` })
  }
  next()
}