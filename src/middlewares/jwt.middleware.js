import jwt from "jsonwebtoken";
import BlacklistRepository from "../features/user/blacklists/blacklist.repository.js";

const blackListRepository = new BlacklistRepository();

const Auth = async (req, res, next) => {
  const { authToken } = req.cookies;
  const blacklistTokens = await blackListRepository.getAll();
  if (!authToken || blacklistTokens.some((item) => item.token == authToken)) {
    return res.status(400).json({
      success: false,
      message: "unauthorized! login to continue!",
    });
  }

  try {
    const payload = jwt.verify(authToken, process.env.SECRET_KEY);
    req.userId = payload.userId;
    req.userRole = payload.userRole;
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "unauthorized! login to continue!",
    });
  }
  next();
};

export default Auth;
