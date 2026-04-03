// Initialize MongoDB user - check if user already exists
db = db.getSiblingDB('admin');

// Check if the root user was already created by MONGO_INITDB_ROOT_USERNAME
// If so, use those credentials
var existingUser = db.getUser("tracker_user");

if (!existingUser) {
  // User doesn't exist, create it
  db.createUser({
    user: "tracker_user",
    pwd: "tracker_password",
    roles: [
      {
        role: "dbOwner",
        db: "back-on-track"
      },
      {
        role: "readWrite",
        db: "back-on-track"
      }
    ]
  });
  print("Created user 'tracker_user'");
} else {
  // User exists, update permissions to ensure it can access back-on-track
  db.updateUser("tracker_user", {
    roles: [
      {
        role: "dbOwner",
        db: "back-on-track"
      },
      {
        role: "readWrite",
        db: "back-on-track"
      }
    ]
  });
  print("Updated roles for 'tracker_user'");
}
