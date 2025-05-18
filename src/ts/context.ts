import { State } from './state.js';
import { SceneController } from './sceneController.js';
import { Translator } from './translator.js';
import { SoundPlayer } from './soundPlayer.js';
import { SimplePhysicsController } from './simplePhysicsController.js';
import { debugPrint } from './runtime.js';
import { CompanyLogoState } from './companyLogoState.js'
import { GameSettings } from './gameSettings.js'

export class Context {
  public isRunning: boolean = false
  public sceneController: SceneController
  public translator = new Translator()

  readonly canvas?: HTMLCanvasElement | null = document.querySelector("canvas")
  private state: State
  private debugEnabled: boolean
  public soundPlayer: SoundPlayer = new SoundPlayer(0.7)

  constructor(
    debugEnabled: boolean
  ) {
      this.debugEnabled = debugEnabled; 
      this.state = new CompanyLogoState(
        "Company Logo State",
        this
      );

      if (!this.canvas || this.canvas == undefined) {
        this.raiseCriticalError("Canvas in NULL!!!!");
      }
      const canvas = this.canvas!;

      const physicsController = new SimplePhysicsController()
      const gameSettings = GameSettings.default()

      this.sceneController = new SceneController(
        canvas,
        physicsController,
        false,
        gameSettings,
        false
      );
      debugPrint("Game Context Initialized...");
  }

  public start(
    state: State
  )
  {   
    this.state = state;
    this.isRunning = true;     
    this.transitionTo(this.state);    
  }

  public raiseCriticalError(error: string) {
    if (this.debugEnabled) {
      console.error(error);
    }
    else {
      alert(error);
    }
    this.isRunning = false;
  }

  public transitionTo(state: State): void {
    debugPrint(`Transitioning to ${state.name}`);
    this.state = state;
    this.state.initialize();
  }

  public step() {
    this.state.step();    
    this.sceneController.step();
  }
}
