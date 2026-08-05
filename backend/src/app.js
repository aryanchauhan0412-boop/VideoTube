import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
  origin : process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Social Media Backend API</title>
        <style>
            body{
                font-family: Arial, sans-serif;
                background:#0f172a;
                color:white;
                text-align:center;
                padding:60px;
            }

            .container{
                max-width:700px;
                margin:auto;
            }

            h1{
                color:#38bdf8;
            }

            a{
                color:#22c55e;
                text-decoration:none;
            }

            ul{
                text-align:left;
                display:inline-block;
            }

            .card{
                background:#1e293b;
                padding:30px;
                border-radius:12px;
            }
        </style>
    </head>

    <body>

        <div class="container">

            <div class="card">

                <h1>🚀 Social Media Backend API</h1>

                <p>Backend is running successfully.</p>

                <h3>Tech Stack</h3>

                <ul>
                    <li>Node.js</li>
                    <li>Express.js</li>
                    <li>MongoDB</li>
                    <li>JWT Authentication</li>
                    <li>Cloudinary</li>
                </ul>

                <h3>Available Routes</h3>

                <ul>
                    <li>/api/v1/users</li>
                    <li>/api/v1/videos</li>
                    <li>/api/v1/comments</li>
                    <li>/api/v1/likes</li>
                    <li>/api/v1/subscriptions</li>
                </ul>

                <p>
                    <a href="https://github.com/aryanchauhan-developer/VideoTube">GitHub Repository</a>
                </p>
                <p>
                    <a href="https://documenter.getpostman.com/view/52464367/2sBY4VHwbD">API Documentation</a>
                </p>

            </div>

        </div>

    </body>

    </html>
    `);
});

// routes
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import feedRouter from "./routes/feed.routes.js"

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/feed", feedRouter);


export {app}