/* global wait */

module.exports = async client => {
  delete client.user.email;
  delete client.user.verified;
  await wait(2000);
};