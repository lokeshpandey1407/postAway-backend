import UserProfileRepository from "./userProfile.repository.js";

export default class UserProfileController {
  constructor() {
    this.userProfileRepository = new UserProfileRepository();
  }

  async updateProfile(req, res, next) {
    try {
      const id = req.params.profileId;
      const profile = await this.userProfileRepository.update(id, req.body);
      if (profile) {
        res.status(201).json({
          success: true,
          message: "Profile updated successfully",
          data: profile,
        });
      } else {
        res.status(201).json({
          success: false,
          message: "Cannot update User Profile.",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const id = req.params.profileId;
      const profiles = await this.userProfileRepository.get(id);
      res.status(200).json({
        success: true,
        message: "",
        data: profiles,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getAllProfile(req, res, next) {
    try {
      const profiles = await this.userProfileRepository.getAll();
      res.status(200).json({
        success: true,
        message: "",
        data: profiles,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}
