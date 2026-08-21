import requests
import os
from logger import logging
from exception import CustomException
import sys
from dotenv import load_dotenv
load_dotenv()

TRANSLATION_API_KEY = os.getenv("TRANSLATION_API_KEY")




class Translator:
    def __init__(self, from_lang="hi", to_lang="en"):
        self.key = TRANSLATION_API_KEY
        self.url = "https://translation.googleapis.com/language/translate/v2"
        self.from_lang = from_lang
        self.to_lang = to_lang

    
    def translate(self, text):
        params = {"key": self.key}
        data = {
            "q": text,
            "source": self.from_lang,
            "target": self.to_lang,
            "format": "text"
        }

        response = requests.post(self.url, params=params, json=data)
        result = response.json()

        print("TRANSLATE API RAW RESPONSE:", result)  

        if "error" in result:
            raise RuntimeError(f"Translation API error: {result['error']}")

        return result["data"]["translations"][0]["translatedText"]



    




