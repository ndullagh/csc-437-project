// src/services/destination-svc.ts
import { Schema, model } from "mongoose";
const ProfileSchema = new Schema({
    userid: String,
    teststring: String
}, { collection: "Profile" });
const ProfileModel = model("Profile", ProfileSchema);
function index() {
    return ProfileModel.find();
}
//TODO make all restful like this
function get(userid) {
    return ProfileModel.find({ userid: userid })
        .then((list) => {
        if (!list || list.length === 0)
            throw `List Not Found`;
        return list[0].toObject();
    })
        .catch((err) => {
        throw `${userid} Not Found`;
    });
}
/*function put(userid: string, newProfile: Profile): Promise<Profile | undefined> {
  return ProfileModel.find( {userid: userid} )
    .then((list) => {
        if(!list) throw `List Not Found`;
        if(list.length > 0) throw `Profiles already exist with userid ${userid}.`
        list
        return list[0].toObject() as Profile
      })
    .catch((err) => {
      throw `${userid} Not Found`;
    });
}*/
function update(userid, profile) {
    return ProfileModel.findOne({ userid: userid })
        .then((found) => {
        if (!found)
            throw `${userid} Not Found`;
        else
            return ProfileModel.findByIdAndUpdate(found._id, profile, {
                new: true
            });
    })
        .then((updated) => {
        if (!updated)
            throw `${userid} not updated`;
        else
            return updated;
    });
}
export default { index, get, update };
