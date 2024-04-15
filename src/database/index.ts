import mongoose, { Mongoose } from "mongoose";

class AppDatabase {
  private url = "mongodb://localhost:27017/fit-me";
  // private url = "mongodb://useradmin:thepianohasbeendrinking@185.196.213.144:27017/fitme?authSource=admin"
  private dbName = "fit-me";

  async connect(): Promise<Mongoose> {
    try {
      console.log(this.url);

      return await mongoose.connect(`${this.url}`);
    } catch (e) {
      throw Error("Failed to establish connection database");
    }
  }
}

export default AppDatabase;
