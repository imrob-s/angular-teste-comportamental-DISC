import { Component } from '@angular/core';
import quizz_questions from '../../../assets/data/quizz_questions.json';

interface QuizzResult {
  id: number;
  title: string;
  description_1: string;
  description_2: string;
}

interface QuizzQuestions {
  title: string;
  questions: any[];
  results: {
    A: QuizzResult[];
    B: QuizzResult[];
    C: QuizzResult[];
    D: QuizzResult[];
  };
}

type QuizzResultsKeys = keyof QuizzQuestions['results'];

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss']
})
export class QuizzComponent {
  title: string = "";
  questions: any;
  questionSelected: any;
  answers: string[] = [];
  selectedTitle: string = "";
  selectedDescription1: string = "";
  selectedDescription2: string = "";
  questionIndex: number = 0;
  questionMaxIndex: number = 0;
  finished: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (quizz_questions) {
      this.finished = false;
      this.title = quizz_questions.title;
      this.questions = quizz_questions.questions;
      this.questionSelected = this.questions[this.questionIndex];
      this.questionMaxIndex = this.questions.length;
    }
  }

  playerChoose(value: string): void {
    this.answers.push(value);
    this.nextStep();
  }

  async nextStep(): Promise<void> {
    this.questionIndex++;

    if (this.questionIndex < this.questions.length) {
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      const finalAnswer = await this.checkResult(this.answers);
      this.finished = true;

      const selectedResult = quizz_questions.results[finalAnswer as QuizzResultsKeys]?.[0];

      if (selectedResult) {
        this.selectedTitle = selectedResult.title;
        this.selectedDescription1 = selectedResult.description_1;
        this.selectedDescription2 = selectedResult.description_2;
      }

      console.log(this.answers);
    }
  }

  async checkResult(answers: string[]): Promise<string> {
    const result = answers.reduce((previous, current) =>
      answers.filter(item => item === previous).length >
      answers.filter(item => item === current).length
        ? previous
        : current
    );

    return result;
  }
}
