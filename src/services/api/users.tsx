import instance from "../instance";

class users {
  async getUser() {
    return await instance
      .get(`/user`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }
  async getListUser(query: string) {
    return await instance
      .get(`/users?${query}`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async createUser(body: unknown) {
    return await instance.post(`/users`, body).then((res) => res.data);
  }

  async updateUser(body: unknown, id: string) {
    return await instance
      .put(`/users/${id}/edit`, body)
      .then((res) => res.data);
  }

  async resetPassword(id: string) {
    return await instance
      .put(`/users/${id}/reset-password`)
      .then((res) => res.data);
  }
  async changePassword(body: unknown, id: string) {
    return await instance
      .post(`/users/${id}/change-password`, body)
      .then((res) => res.data);
  }

  async updateUserStatus(body: unknown, id: string) {
    return await instance
      .put(`/users/${id}/change-status`, body)
      .then((res) => res.data);
  }

  async logout() {
    return await instance.post(`/logout`).then((res) => res.data);
  }

  async deleteUser(id: string) {
    return await instance.delete(`/users/delete/${id}`).then((res) => res.data);
  }

  async getDetailUser(id?: string) {
    return await instance
      .get(`/users/${id}`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }
}

export default new users();
