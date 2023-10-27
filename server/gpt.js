import { pipeline, env } from "@xenova/transformers";

// Specify a custom location for models (defaults to '/models/').
env.localModelPath = "./models/";

// Disable the loading of remote models from the Hugging Face Hub:
env.allowRemoteModels = false;
env.allowLocalModels = true;

env.cacheDir = "./models/cache/";

// Set location of .wasm files. Defaults to use a CDN.
env.backends.onnx.wasm.wasmPaths = "./models/wasm/";

export class PipelineFactory {
  tokenizer;
  static task = "";
  static model = "";
  static instance = null;

  constructor(tokenizer, model) {
    this.tokenizer = tokenizer;
    PipelineFactory.model = model;
  }

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

export class Pipeline extends PipelineFactory {
  static task = "text2text-generation";
  static model = "Xenova/LaMini-Flan-T5-783M";
}

export const pipe = await Pipeline.getInstance(/*(progress) => {}*/);
