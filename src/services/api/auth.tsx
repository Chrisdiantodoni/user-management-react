import instance from "../instance";

class auth {
  async login(body: unknown) {
    return await instance.post(`/auth/login`, body).then((res) => res.data);
  }
}
export default new auth();
