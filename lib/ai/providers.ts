import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { openai } from '@ai-sdk/openai';
import { fireworks } from '@ai-sdk/fireworks';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENAI_API_KEY,
});

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model-small': chatModel,
        'chat-model-large': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model-small': openrouter('google/gemini-2.0-pro-exp-02-05:free'),
        'chat-model-large': openrouter('qwen/qwen-2-7b-instruct:free'),
        'chat-model-reasoning': wrapLanguageModel({
          model: openrouter('qwen/qwq-32b:free'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': openrouter('qwen/qwen-2-7b-instruct:free'),
        'artifact-model': openrouter('qwen/qwen-2-7b-instruct:free'),
      },
      imageModels: {
        // 'small-model':openrouter('deepseek/deepseek-r1-zero:free'),
        // 'large-model': openrouter('deepseek/deepseek-r1-zero:free'),
      },
    });
