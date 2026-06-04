import { Profile } from "../models";
declare function index(): Promise<Profile[]>;
declare function get(userid: string): Promise<Profile | undefined>;
declare function update(userid: string, profile: Profile): Promise<Profile>;
declare const _default: {
    index: typeof index;
    get: typeof get;
    update: typeof update;
};
export default _default;
