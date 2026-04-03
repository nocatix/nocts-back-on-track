// Initialize MongoDB user
db = db.getSiblingDB('admin');
db.createUser({
  user: "tracker_user",
  pwd: "tracker_password",
  roles: [
    {
      role: "root"
    }
  ]
});
