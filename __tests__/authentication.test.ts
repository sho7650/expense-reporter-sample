import { Authentication } from "../src/controllers/auth/index";
import { User } from "../src/models/user";

describe("authentication", () => {
  it("serialize", (done) => {
    const callback = (arg: any, user: User) => {
      expect(user.id).toBe("811fcb5d-7128-4aa6-bfee-f1a8d3302cda");
      expect(user.email).toBe("test@example.com");
      expect(arg).toBeNull();
      done();
    };
    const user_sample = {
      id: "811fcb5d-7128-4aa6-bfee-f1a8d3302cda",
      last_name: "test",
      email: "test@example.com",
    };

    Authentication.serializeUser(user_sample, callback);
  });

  it("deserialize - positive", (done) => {
    const callback = (arg: any, user: any) => {
      expect(arg).toBeNull();
      expect(user.id).toBe("811fcb5d-7128-4aa6-bfee-f1a8d3302cda");
      done();
    };
    const user_sample = {
      id: "811fcb5d-7128-4aa6-bfee-f1a8d3302cda",
      last_name: "test",
      email: "test@example.com",
    };

    Authentication.deserializeUser(user_sample, callback);
  });
  it("deserialize - negative", (done) => {
    const callback = (arg: any, user: any) => {
      expect(arg).toBeNull();
      expect(user).toBe(false);
      done();
    };
    const user_sample = {
      id: "",
      last_name: "test",
      email: "test@example.com",
    };

    Authentication.deserializeUser(user_sample, callback);
  });

  it("verify - positive", (done) => {
    const callback = (arg: any, user: any) => {
      expect(arg).toBeNull();
      expect(user.id).toBe("811fcb5d-7128-4aa6-bfee-f1a8d3302cda");
      expect(user.email).toBe("test@example.com");
      expect(user.last_name).toBe("test");
      done();
    };

    Authentication.verifyLocal("test@example.com", "password", callback);
  });

  it("verify - negative", (done) => {
    const callback = (arg: any, user: any) => {
      expect(arg).toBeNull();
      expect(user).toBe(false);
      done();
    };

    Authentication.verifyLocal("test@example.com", "incorrect", callback);
  });

  it("verify - deleted", (done) => {
    const callback = (arg: any, user: any) => {
      expect(arg).toBeNull();
      expect(user).toBe(false);
      done();
    };

    Authentication.verifyLocal("deleted@example.com", "password", callback);
  });
});
