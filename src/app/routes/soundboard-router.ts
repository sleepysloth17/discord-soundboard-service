import { Router } from "express";

import {
  SoundboardItem,
  serialiseSoundboardItems,
} from "../services/soundboard-items/soundboard-item";
import soundboardService from "../services/soundboard-service";
import voiceService from "../services/voice/voice-service";
import { UUID } from "../utils/uuid";

const soundboardRouter = Router();

soundboardRouter.get("/", (req, res) => {
  soundboardService
    .getItems()
    .then((items: SoundboardItem[]) =>
      res.json(serialiseSoundboardItems(items)),
    );
});

soundboardRouter.delete("/", (req, res) => {
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
