import http from "node:http";

const users = [
  { name: "eyad", age: 20 },
  { name: "ahmed", age: 18 },
];

const server = http.createServer((req, res) => {
  // create user
  if (method === "POST" && url === "/users") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const data = JSON.parse(body);
      users.push(data);
    });
    res.writeHead(201);
  }
  // get all users
  else if (method === "GET" && url === "/users") {
    res.writeHead(200, { "content-type": "application/json" });
    res.write(JSON.stringify(users));
  }
  // get a single user by name
  else if (method === "GET" && url.startsWith("/users/")) {
    // /users/eyad
    //   0      1
    /// ["", "eyad"]
    const userName = url.split("/users/")[1];
    const user = users.find((u) => u.name === userName);
    if (user) {
      res.writeHead(200, { "content-type": "application/json" });
      res.write(JSON.stringify(user));
    } else {
      res.writeHead(404, { "content-type": "application/json" });
      res.write(JSON.stringify({ error: `user ${userName} not found` }));
    }
  }
  // update user by name (PATCH/PUT)
  else if (
    (method === "PATCH" || method === "PUT") &&
    url.startsWith("/users/")
  ) {
    const userName = url.split("/users/")[1];
    const userIndex = users.findIndex((u) => u.name === userName);

    if (userIndex === -1) {
      res.writeHead(404, { "content-type": "application/json" });
      res.write(JSON.stringify({ error: `user ${userName} not found` }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const data = JSON.parse(body);
      users[userIndex] = { ...users[userIndex], ...data };
      res.writeHead(200, { "content-type": "application/json" });
      res.write(JSON.stringify(users[userIndex]));
    });
  }
  // delete user by name
  else if (method === "DELETE" && url.startsWith("/users/")) {
    const userName = url.split("/users/")[1];
    const userIndex = users.findIndex((u) => u.name === userName);
    if (userIndex === -1) {
      res.writeHead(404, { "content-type": "application/json" });
      res.write(JSON.stringify({ error: `user ${userName} not found` }));
      return;
    }
    const [deletedUser] = users.splice(userIndex, 1);
    res.writeHead(200, { "content-type": "application/json" });
    res.write(JSON.stringify(deletedUser));
  }
  // no route matched
  else {
    res.writeHead(404, { "content-type": "application/json" });
    res.write(JSON.stringify({ error: "not found" }));
  }
});
res.end();
server.listen(3000, () => {
  console.log("server started on port 3000");
});
