---
name: OpenRouter Inference
description: Use this to write code to call an LLM using LiteLLM and OpenRouter
---

# Calling an LLM via OpenRouter

These instructions allow you write code to call an LLM via OpenRouter.
This method uses LiteLLM and OpenRouter.

## Setup

The OPENROUTER_API_KEY must be set in the .env file and loaded in as an environment variable.

The uv project must include litellm and pydantic.
`uv add litellm pydantic`

## Code snippets

Use code like these examples in order to use OpenRouter.

### Imports and constants

```python
from litellm import completion
MODEL = "openrouter/nvidia/nemotron-3-super-120b-a12b:free"
```

### Code to call via OpenRouter for a text response

```python
response = completion(model=MODEL, messages=messages)
result = response.choices[0].message.content
```

### Code to call via OpenRouter for a Structured Outputs response

```python
response = completion(model=MODEL, messages=messages, response_format=MyBaseModelSubclass)
result = response.choices[0].message.content
result_as_object = MyBaseModelSubclass.model_validate_json(result)
```
