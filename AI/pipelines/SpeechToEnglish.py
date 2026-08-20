from utils.translator import Translator
from utils.transcriber import Transcriber


class SpeechPipeline():
    def __init__(self, filename="voice.mp3", from_lang="hi", to_lang="en"):
        self.transcriber = Transcriber(filename)
        self.translator = Translator(from_lang, to_lang)


    def transcribe_translate(self):
        text = self.transcriber.transcribe()
        translation = self.translator.translate(text)
        return translation


sp = SpeechPipeline()
sp.transcribe_translate()