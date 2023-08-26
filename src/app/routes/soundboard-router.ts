import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import {
  SoundboardItem,
  serialiseSoundboardItems,
} from "../services/soundboard-items/soundboard-item";
import soundboardService from "../services/soundboard-service";
import voiceService from "../services/voice/voice-service";
import { UUID } from "../utils/uuid";

const soundboardRouter = Router();

const validateQueryParams: (
  ...expectedQueryParams: string[]
) => (req: Request, res: Response, next: NextFunction) => void = (
  ...expectedQueryParams: string[]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const expectedQueryParam of expectedQueryParams) {
      if (!req.query[expectedQueryParam]) {
        return res.status(400).send(`Missing: ${expectedQueryParam}`);
      }
    }
    next();
  };
};

// https://medium.com/@sidharth016/uploading-files-with-nodejs-f3263b5f0cdd
// https://stackoverflow.com/questions/25698176/how-to-set-different-destinations-in-nodejs-using-multer
// curl -F "file=@$PWD/test-upload.txt" "http://localhost:3000/soundboard"
const storage = multer.diskStorage({
  filename: function (request, file, callback) {
    const id: UUID = UUID.random();
    request.res.locals.id = id;
    callback(null, `${id.value}.mp3`);
  },
  destination: function (request, file, callback) {
    callback(null, path.join(__dirname, "../../assets/audio"));
  },
});

const upload = multer({
  fileFilter: (req, file, callback) => {
    return callback(null, true); // TODO - check filetype
  },
  storage: storage,
});

soundboardRouter.get("/", (req, res) => {
  soundboardService
    .getItems()
    .then((items: SoundboardItem[]) =>
      res.json(serialiseSoundboardItems(items)),
    );
});

soundboardRouter.post(
  "/",
  [validateQueryParams("icon", "name"), upload.single("audioFile")],
  (req, res) => {
    if (!res.locals.id) {
      res.status(400).send("File was not uploaded");
    } else {
      soundboardService
        .saveItem(res.locals.id, req.query.name, req.query.icon)
        .then(() => {
          res.send(
            `Saved audio with properties: {id: ${res.locals.id.value} icon: ${req.query.icon}, name: ${req.query.name}}`,
          );
        });
    }
  },
);

soundboardRouter.post("/stop", (req, res) => {
  voiceService
    .stop()
    .then((stopped: boolean) =>
      res.send(
        stopped
          ? "Stop audio playback of current sound"
          : "Not stopped audio playback of current sound",
      ),
    );
});

soundboardRouter.post("/:id", (req, res) => {
  UUID.of(req.params.id).ifPresent((id: UUID) => {
    soundboardService
      .playSound(id)
      .then((triggered: boolean) =>
        res.send(
          triggered
            ? `Audio playback of ${req.params.id} triggered in currently connected voice channel`
            : `No audio playback triggered for ${req.params.id} as not connected to voice channel`,
        ),
      );
  });
});

export default soundboardRouter;
