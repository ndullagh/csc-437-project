// src/services/destination-svc.ts
import { Schema, model } from "mongoose";
import { Profile } from "../models"; // models/index.ts exports

const ProfileSchema = new Schema<Profile>(
    {
        userid: String,
        teststring: String
    },
    { collection: "Profile" }
);

const ProfileModel = model<Profile>(
    "Profile",
    ProfileSchema
);


function index(): Promise<Profile[]> {
  return ProfileModel.find();
}

//TODO make all restful like this
function get(userid: string): Promise<Profile | undefined> {
  return ProfileModel.find( {userid: userid} )
    .then((list) => {
        if(!list || list.length === 0) throw `List Not Found`;
        return list[0].toObject() as Profile 
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

function update(
  userid: string,
  profile: Profile
): Promise<Profile> {
  return ProfileModel.findOne({ userid: userid })
    .then((found) => {
      if (!found) throw `${userid} Not Found`;
      else  
        return ProfileModel.findByIdAndUpdate(
          found._id,
          profile,
          {
            new: true
          }
        );
    })
    .then((updated) => {
      if (!updated) throw `${userid} not updated`;
      else return updated as Profile;
    });
}


export default { index, get, update };