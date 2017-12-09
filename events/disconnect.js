module.exports = (client, event) => {
    console.log("Disconnected: " + event.reason + " (" + event.code + ")");
  };