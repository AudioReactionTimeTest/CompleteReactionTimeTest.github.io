import Test from './Test.js';

/**
 * @class TestAudio
 */
export default class TestAudio extends Test {

    audioContext: AudioContext;
    gainNode!: GainNode;
    oscillator!: OscillatorNode;
    DOMWaveSelect!: HTMLSelectElement;
    DOMPitchInput!: HTMLInputElement;
    DOMVolumeInput!: HTMLInputElement;

    constructor() {
        super();
        this.settingsKey = 'AudioTest_Settings';
        this.settings.audio = {
            volume: 0.5,
            frequency: 260,
            type: 'square'
        };
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext);

        document.addEventListener('mousedown', () => { this.oscillator.start() }, { once: true });
    }


    startAction(): void {
        this.gainNode.connect(this.audioContext.destination);
    }

    stopAction(): void {
        this.gainNode.disconnect(this.audioContext.destination);
    }

    private createAudioObject() {
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.frequency.setValueAtTime(this.settings.audio.frequency, this.audioContext.currentTime);
        this.oscillator.type = this.settings.audio.type;
        let gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.settings.audio.volume;
        this.oscillator.connect(gainNode);
        return gainNode;
    }

    private updateAudio() {
        if (this.isTestRunning)
            this.gainNode.disconnect(this.audioContext.destination);
        this.gainNode = this.createAudioObject();
        this.oscillator.start();
        if (this.isTestRunning)
            this.gainNode.connect(this.audioContext.destination);
    }

    private updateSettingsInLocalStorageAndUpdateAudio() {
        this.updateAudio();
        super.updateSettingsInLocalStorage();
    }

    retrieveSettingsFromLocalStorage() {
        super.retrieveSettingsFromLocalStorage();
        this.gainNode = this.createAudioObject();
    }

    initializeDOMElements() {
        super.initializeDOMElements();
        this.DOMWaveSelect = document.getElementById("wave-select") as HTMLSelectElement;
        this.DOMPitchInput = document.getElementById("pitch-input") as HTMLInputElement;
        this.DOMVolumeInput = document.getElementById("volume-input") as HTMLInputElement;

        this.DOMWaveSelect.value = this.settings.audio.type;
        this.DOMPitchInput.value = this.settings.audio.frequency;
        this.DOMVolumeInput.value = this.settings.audio.volume;

        this.DOMWaveSelect.addEventListener('change', () => {
            this.settings.audio.type = this.DOMWaveSelect.value;
            this.updateSettingsInLocalStorageAndUpdateAudio();

        });

        this.DOMPitchInput.addEventListener('change', () => {
            this.settings.audio.frequency = parseInt(this.DOMPitchInput.value);
            this.updateSettingsInLocalStorageAndUpdateAudio();
        });

        this.DOMVolumeInput.addEventListener('change', () => {
            this.settings.audio.volume = parseFloat(this.DOMVolumeInput.value);
            this.updateSettingsInLocalStorageAndUpdateAudio();
        });
    }
}
