<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Translatornator</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <ion-list>
                <ion-item>
                    <ion-select aria-label="engine" interface="action-sheet" placeholder="Translation Engine"
                        @ionChange="setEngineSelection">
                        <ion-select-option v-for="engine in translationEngines" :value="engine.value" :key="engine.value">{{
                            engine.text }}</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>

            <ion-list v-if="selectedEngine == 'MLKit'">
                <ion-item>
                    <ion-select aria-label="sourceLanguage" interface="action-sheet" placeholder="Source Language"
                        @ionChange="setSourceLanguageSelection">
                        <ion-select-option v-for="language in languages" :value="language.value" :key="language.value">{{
                            language.text }}</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>

            <ion-item>
                <ion-label position="floating">Enter text</ion-label>
                <ion-input v-model="inputText"></ion-input>
            </ion-item>

            <ion-list>
                <ion-item>
                    <ion-select aria-label="language" interface="action-sheet" placeholder="Target Language"
                        @ionChange="setLanguageSelection">
                        <ion-select-option v-for="language in languages" :value="language.value" :key="language.value">{{
                            language.text }}</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>

            <ion-item>
                <ion-label position="floating">Translated text</ion-label>
                <ion-input readonly :value="translatedText"></ion-input>
            </ion-item>

            <ion-button @click="translate">Translate</ion-button>
            <ion-button @click="writeToClipboard"><ion-icon :icon="clipboardOutline"></ion-icon></ion-button>
            <ion-button @click="speak"><ion-icon :icon="volumeHigh"></ion-icon></ion-button>

            <ion-loading :is-open="loading" message="Loading..." spinner="dots"></ion-loading>

            <ion-alert :is-open="error" @didDismiss="error = false" header="Error" :message="errorMessage"></ion-alert>

        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar, IonButton, IonItem, IonIcon, IonGrid, IonRow, IonCol, IonList, IonSelect, IonSelectOption, IonLabel, IonAlert, IonLoading } from '@ionic/vue';
import { clipboardOutline, volumeHigh } from "ionicons/icons"
import { defineComponent } from 'vue';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Clipboard } from '@capacitor/clipboard';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Translation, Language } from '@capacitor-mlkit/translation';

export default defineComponent({
    components: {
        IonLoading,
        IonAlert,
        IonLabel,
        IonList,
        IonSelect,
        IonSelectOption,
        IonCol,
        IonGrid,
        IonRow,
        IonIcon,
        IonContent,
        IonHeader,
        IonPage,
        IonTitle,
        IonToolbar,
        IonItem,
        IonInput,
        IonButton,
    },
    data() {
        return {
            inputText: undefined as string | undefined,
            translatedText: undefined as string | undefined,
            selectedLanguage: undefined as string | undefined,
            selectedLanguageCode: undefined as string | undefined,
            selectedSourceLanguage: undefined as string | undefined,
            selectedSourceLanguageCode: undefined as string | undefined,
            selectedEngine: undefined as string | undefined,
            errorMessage: undefined as string | undefined,
            error: false,
            loading: false,
            clipboardOutline,
            volumeHigh,
            languages: [
                { text: "Afrikaans", value: 'af' },
                { text: "Arabic", value: 'ar' },
                { text: "Belarusian", value: 'be' },
                { text: "Bulgarian", value: 'bg' },
                { text: "Bengali", value: 'bn' },
                { text: "Catalan", value: 'ca' },
                { text: "Czech", value: 'cs' },
                { text: "Welsh", value: 'cy' },
                { text: "Danish", value: 'da' },
                { text: "German", value: 'de' },
                { text: "Greek", value: 'el' },
                { text: "English", value: 'en' },
                { text: "Esperanto", value: 'eo' },
                { text: "Spanish", value: 'es' },
                { text: "Estonian", value: 'et' },
                { text: "Persian", value: 'fa' },
                { text: "Finnish", value: 'fi' },
                { text: "French", value: 'fr' },
                { text: "Irish", value: 'ga' },
                { text: "Galician", value: 'gl' },
                { text: "Gujarati", value: 'gu' },
                { text: "Hebrew", value: 'he' },
                { text: "Hindi", value: 'hi' },
                { text: "Croatian", value: 'hr' },
                { text: "Haitian", value: 'ht' },
                { text: "Hungarian", value: 'hu' },
                { text: "Indonesian", value: 'id' },
                { text: "Icelandic", value: 'is' },
                { text: "Italian", value: 'it' },
                { text: "Japanese", value: 'ja' },
                { text: "Georgian", value: 'ka' },
                { text: "Kannada", value: 'kn' },
                { text: "Korean", value: 'ko' },
                { text: "Lithuanian", value: 'lt' },
                { text: "Latvian", value: 'lv' },
                { text: "Macedonian", value: 'mk' },
                { text: "Marathi", value: 'mr' },
                { text: "Malay", value: 'ms' },
                { text: "Maltese", value: 'mt' },
                { text: "Dutch", value: 'nl' },
                { text: "Norwegian", value: 'no' },
                { text: "Polish", value: 'pl' },
                { text: "Portuguese", value: 'pt' },
                { text: "Romanian", value: 'ro' },
                { text: "Russian", value: 'ru' },
                { text: "Slovak", value: 'sk' },
                { text: "Slovenian", value: 'sl' },
                { text: "Albanian", value: 'sq' },
                { text: "Swedish", value: 'sv' },
                { text: "Swahili", value: 'sw' },
                { text: "Tamil", value: 'ta' },
                { text: "Telugu", value: 'te' },
                { text: "Thai", value: 'th' },
                { text: "Tagalog", value: 'tl' },
                { text: "Turkish", value: 'tr' },
                { text: "Ukrainian", value: 'uk' },
                { text: "Urdu", value: 'ur' },
                { text: "Vietnamese", value: 'vi' },
                { text: "Chinese", value: 'zh' },
            ],
            translationEngines: [
                { text: "DeepL", value: "DeepL" },
                { text: "ChatGPT", value: "ChatGPT" },
                { text: "MLKit", value: "MLKit" },
            ]
        };
    },
    methods: {
        async translate() {
            if (this.inputText == undefined || this.selectedLanguage == undefined || this.selectedLanguageCode == undefined || this.selectedEngine == undefined) {
                return
            }

            switch (this.selectedEngine) {
                case "ChatGPT":
                    this.translateChatGPT();
                    break;
                case "DeepL":
                    this.translateDeepL();
                    break;
                case "MLKit":
                    this.translateMLKit();
                    break;
            }
        },
        async downloadModel(language: Language) {
            await Translation.downloadModel({
                language: language
            })
        },
        async getDownloadedModels() {
            const { languages } = await Translation.getDownloadedModels();
            return languages;
        },
        async translateMLKit() {
            this.loading = true;

            const sourceLanguage = Language[this.selectedSourceLanguage as keyof typeof Language];
            const targetLanguage = Language[this.selectedLanguage as keyof typeof Language];

            const downloadedModels = await this.getDownloadedModels();

            if (!downloadedModels.includes(sourceLanguage)) {
                await this.downloadModel(sourceLanguage);
            }

            if (!downloadedModels.includes(targetLanguage)) {
                await this.downloadModel(targetLanguage);
            }

            const translation = await Translation.translate({
                text: this.inputText as string,
                sourceLanguage: sourceLanguage,
                targetLanguage: targetLanguage
            });

            this.translatedText = translation.text;

            this.loading = false;
        },
        async translateChatGPT() {
            this.loading = true;

            try {
                const options = {
                    url: 'https://api.openai.com/v1/chat/completions',
                    headers: {
                        'Content-Type': 'application/json',
                        "Accept": "application/json",
                        "Authorization": "Bearer [OPENAI KEY]",
                        "OpenAI-Organization": "org-7siemkBnprvFx9SakzeteLxx",
                        "User-Agent": "OpenAI/NodeJS/3.3.0"
                    },
                    data: {
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                "role": "system",
                                "content": `Your role is to translate text to ${this.selectedLanguage} without giving any additional information. Translate every request!`
                            },
                            {
                                "role": "user",
                                "content": this.inputText
                            }
                        ],
                        temperature: 0.7,
                        max_tokens: 2048,
                        top_p: 1.0,
                        frequency_penalty: 0.0,
                        presence_penalty: 0.0,
                    },
                };

                const response: HttpResponse = await CapacitorHttp.post(options);

                this.translatedText = response.data.choices[0].message?.content;
            }
            catch (error) {
                this.loading = false;
                this.errorMessage = "ChatGPT could not be reached.";
                this.error = true;
            }

            this.loading = false;
        },
        async translateDeepL() {
            this.loading = true;

            try {
                const options = {
                    url: 'https://translatorproxyfunction.azurewebsites.net/api/HttpTrigger1?code=-jVIV1bbEwkgBLfmaLfNL5FFxtKCGgFPA2iqEMjI2_fRAzFuL24nJA==',
                    headers: { 'Content-Type': 'application/json' },
                    data: { text: this.inputText, target_lang: this.selectedLanguageCode },
                };

                const response: HttpResponse = await CapacitorHttp.post(options);

                this.translatedText = JSON.parse(response.data).translations[0].text;
            }
            catch (error) {
                this.loading = false;
                this.errorMessage = "It seems your selected language is not supported in the selected engine.";
                this.error = true;
            }

            this.loading = false;
        },
        async writeToClipboard() {
            await Clipboard.write({
                string: this.translatedText
            })
        },
        async speak() {
            if (this.translatedText != undefined) {
                await TextToSpeech.speak({
                    text: this.translatedText,
                    lang: this.selectedLanguageCode,
                    rate: 1.0,
                    pitch: 1.0,
                    volume: 1.0,
                    category: 'ambient',
                });
            }
        },
        setLanguageSelection(event: { detail: { value: string | undefined; }; }) {
            this.selectedLanguageCode = event.detail.value;
            this.selectedLanguage = this.languages.find(language => language.value == this.selectedLanguageCode)?.text;
        },
        setSourceLanguageSelection(event: { detail: { value: string | undefined; }; }) {
            this.selectedSourceLanguageCode = event.detail.value;
            this.selectedSourceLanguage = this.languages.find(language => language.value == this.selectedLanguageCode)?.text;
        },
        setEngineSelection(event: { detail: { value: string | undefined; }; }) {
            this.selectedEngine = this.translationEngines.find(engine => engine.value == event.detail.value)?.text;
        }
    }
});
</script>
  
<style scoped>
ion-content {
    --background: #f4f4f4;
}
</style>