const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  topicName: { type: String, default: "", required: true },
  description: { type: String, default: "" },
  startDate: { type: Date },
  status: { type: String },
  // relativeDocs : { type: string, default: 0, required: true }, //Todo
  addedOn: { type: Number, default: Date.now() },
  modifiedOn: { type: Number, default: Date.now() },
});

todoSchema.method({
  saveData: async function () {
    return this.save();
  },
});
todoSchema.static({
  findData: function (findObj) {
    return this.find(findObj);
  },
  findOneData: function (findObj) {
    return this.findOne(findObj);
  },
  findOneAndUpdateData: function (findObj, updateObj) {
    return this.findOneAndUpdate(findObj, {...updateObj, modifiedOn: Date.now()}, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  },
  findDataWithAggregate: function (findObj) {
    return this.aggregate(findObj);
  },
  findDataWithPagination: function (findObj, skip, limit, sortingKey) {
    return this.find(findObj)
      .skip(parseInt(skip * limit))
      .limit(parseInt(limit))
      .sort(sortingKey)
      .exec();
  },
  getDocuments: function (
    requestData,
    selectionKeys,
    offset,
    limit,
    sortingKey
  ) {
    return this.find(requestData, selectionKeys)
      .collation({locale: "en" })
      .skip(parseInt(limit * offset))
      .limit(parseInt(limit))
      .sort(sortingKey)
      .exec();
  },
  countData: function (findObj) {
    return this.count(findObj);
  },
});
export default mongoose.model("ksa-todo", todoSchema);
