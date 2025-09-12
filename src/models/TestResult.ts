// // src/models/TestResult.ts
// import mongoose, { Schema, Document } from "mongoose";

// export interface ITestResult extends Document {
//   resultId?: mongoose.Types.ObjectId; // backlink to Result (optional)
//   exerciseType: string;
//   score: number;
//   feedback: string[];
//   corrections: string[];
//   createdAt: Date;
// }

// const TestResultSchema = new Schema<ITestResult>(
//   {
//     resultId: { type: Schema.Types.ObjectId, ref: "Result" }, // optional backlink
//     exerciseType: { type: String, required: true },
//     score: { type: Number, required: true },
//     feedback: { type: [String], default: [] },
//     corrections: { type: [String], default: [] },
//     createdAt: { type: Date, default: Date.now },
//   },
//   { timestamps: false } // createdAt already present if you want consistent timestamps; set as desired
// );

// export default mongoose.models.TestResult || mongoose.model<ITestResult>("TestResult", TestResultSchema);
