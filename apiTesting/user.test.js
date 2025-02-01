const mongoose = require("mongoose");
const UserSchema = require("../models/userModel");

const url = "mongodb://localhost:27017/DivaE-Commerce";

beforeAll(async () => {
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Schema Test Suite", () => {
  it("should create a user successfully", async () => {
    const userData = {
      firstName: "Kritima",
      lastName: "Khatri",
      email: "Kritimakhatri123@gmail.com",
      phone: 9865555215,
      password: "P@ssw0rd123",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1l5fR_5J_LRooC8aw-PkMF8XJWK18bdikQQ&s",
    };

    const createdUser = await UserSchema.create(userData);

    expect(createdUser.firstName).toEqual("Kritima");
    expect(createdUser.lastName).toEqual("Khatri");
    expect(createdUser.email).toEqual("Kritimakhatri123@gmail.com");
    expect(createdUser.phone).toEqual(9865555215);
    expect(createdUser.password).toEqual("P@ssw0rd123");
  });

  //update
  // it("should update a user's Schema successfully", async () => {
  //   const updatedUser = await UserSchema.findOneAndUpdate(
  //     { _id: new mongoose.Types.ObjectId("66b8ce60b10a557d513d5187") },
  //     {
  //       $set: {
  //         firstName: "Kritimu",
  //         lastName: "KC",
  //         email: "kritimuu456@gmail.com",
  //         phone: 9861315260,
  //         password: "KriTimaHeroine",
  //         avatar:
  //           "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin%2Fcaptain-america-hd-image-9gag-in-2022--1122451907100282682%2F&psig=AOvVaw0Bh5i1a4cFyI3c8ZzHimMF&ust=1723474763887000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMDsyoea7YcDFQAAAAAdAAAAABAE",
  //       },
  //     },
  //     { new: true }
  //   );

  //   expect(updatedUser.firstName).toEqual("Kritimu");
  //   expect(updatedUser.lastName).toEqual("KC");
  //   expect(updatedUser.email).toEqual("kritimuu456@gmail.com");
  //   expect(updatedUser.phone.toString()).toEqual("9861315260");
  //   expect(updatedUser.word).toEqual("KriTima");
  // });

  //delete

  // it("should delete a user successfully", async () => {
  //   const deleteResult = await UserSchema.findOneAndDelete({
  //     _id: new mongoose.Types.ObjectId("66b8d6e3b6c100d4099163a7"),
  //   });

  //   expect(deleteResult).not.toBeNull();
  //   expect(deleteResult._id.toString()).toEqual("66b8d6e3b6c100d4099163a7");

  //   const deletedUser = await UserSchema.findById("66b8d6e3b6c100d4099163a7");
  //   expect(deletedUser).toBeNull();
  // });
});
