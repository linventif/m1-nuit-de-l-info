import { createSignal, onMount, Show, For } from 'solid-js';
import questionsData from './questions.json';
import config from '../../config';

function Quizz() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = createSignal(0);
    const [score, setScore] = createSignal(0);
    const [showScore, setShowScore] = createSignal(false);
    const [shuffledQuestions, setShuffledQuestions] = createSignal([]);
    const [selectedAnswer, setSelectedAnswer] = createSignal(null);
    const [isCorrect, setIsCorrect] = createSignal(null);

    onMount(() => {
        // Shuffle questions on mount
        const shuffled = [...questionsData.questions].sort(() => 0.5 - Math.random());
        // Take only 10 questions for a session
        setShuffledQuestions(shuffled.slice(0, 10));
    });

    const handleAnswerClick = (index) => {
        if (selectedAnswer() !== null) return; // Prevent multiple clicks

        setSelectedAnswer(index);
        const currentQuestion = shuffledQuestions()[currentQuestionIndex()];
        const correct = index === currentQuestion.correct_answer_index;
        setIsCorrect(correct);

        if (correct) {
            setScore(score() + 1);
            incrPts();
        }

    };

    const handleNextQuestion = () => {
        const nextQuestion = currentQuestionIndex() + 1;
        if (nextQuestion < shuffledQuestions().length) {
            setCurrentQuestionIndex(nextQuestion);
            setSelectedAnswer(null);
            setIsCorrect(null);
        } else {
            setShowScore(true);
        }
    };

    const restartGame = () => {
        const shuffled = [...questionsData.questions].sort(() => 0.5 - Math.random());
        setShuffledQuestions(shuffled.slice(0, 10));
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    const incrPts = () => {
        fetch(config.apiBaseUrl + '/auth/login');

        const player = fetch(config.apiBaseUrl + '/auth/me', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            credentials: 'include',
        }).then(res => res.json())
    }

    return (
        <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-mono">
            <div class="max-w-2xl w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-purple-500">
                <Show when={!showScore()} fallback={
                    <div class="text-center space-y-6 animate-fade-in">
                        <h2 class="text-4xl font-bold text-purple-400">Quiz Terminé!</h2>
                        <div class="text-6xl font-black text-white mb-4">
                            {score()} / {shuffledQuestions().length}
                        </div>
                        <p class="text-gray-400 text-lg">
                            {score() === shuffledQuestions().length ? 'Un sans fautes! Tu es un expert NIRD!' :
                                score() > shuffledQuestions().length / 2 ? 'Bien joué! Continue ton apprentissage.' : 'Challenge toi!'}
                        </p>
                        <button
                            onClick={restartGame}
                            class="btn btn-primary btn-lg w-full mt-8 bg-gradient-to-r from-purple-500 to-pink-600 border-none hover:scale-105 transition-transform"
                        >
                            Rejouer
                        </button>
                        <a href="/" class="btn btn-ghost w-full mt-2">Retour au menu</a>
                    </div>
                }>
                    <Show when={shuffledQuestions().length > 0}>
                        <div class="mb-8 flex justify-between items-center text-gray-400 text-sm uppercase tracking-wider">
                            <span>Question {currentQuestionIndex() + 1}/{shuffledQuestions().length}</span>
                            <span>Score: {score()}</span>
                        </div>

                        <div class="mb-8">
                            <span class="badge badge-secondary mb-4">{shuffledQuestions()[currentQuestionIndex()].category}</span>
                            <h2 class="text-2xl md:text-3xl font-bold leading-tight">
                                {shuffledQuestions()[currentQuestionIndex()].question}
                            </h2>
                        </div>

                        <div class="space-y-4">
                            <For each={shuffledQuestions()[currentQuestionIndex()].options}>
                                {(option, index) => (
                                    <button
                                        onClick={() => handleAnswerClick(index())}
                                        disabled={selectedAnswer() !== null}
                                        class={`w-full p-4 text-left rounded-lg transition-all duration-200 border-2 
                      ${selectedAnswer() === null
                                                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-purple-400'
                                                : index() === shuffledQuestions()[currentQuestionIndex()].correct_answer_index
                                                    ? 'bg-green-900/50 border-green-500 text-green-200'
                                                    : selectedAnswer() === index()
                                                        ? 'bg-red-900/50 border-red-500 text-red-200'
                                                        : 'bg-gray-700/50 border-gray-700 opacity-50'
                                            }
                    `}
                                    >
                                        <div class="flex items-center">
                                            <div class={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold border
                        ${selectedAnswer() === null
                                                    ? 'border-gray-500 text-gray-400'
                                                    : index() === shuffledQuestions()[currentQuestionIndex()].correct_answer_index
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : selectedAnswer() === index()
                                                            ? 'bg-red-500 border-red-500 text-white'
                                                            : 'border-gray-600 text-gray-600'
                                                }
                      `}>
                                                {String.fromCharCode(65 + index())}
                                            </div>
                                            <span class="text-lg">{option}</span>
                                        </div>
                                    </button>
                                )}
                            </For>
                        </div>

                        <Show when={selectedAnswer() !== null}>
                            <div class={`mt-6 p-4 rounded-lg animate-fade-in ${isCorrect() ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
                                <p class="text-sm font-bold mb-1">
                                    {isCorrect() ? 'Correct!' : 'Incorrect'}
                                </p>
                                <p class="text-gray-300 text-sm">
                                    {shuffledQuestions()[currentQuestionIndex()].explanation}
                                </p>
                            </div>
                            <button
                                onClick={handleNextQuestion}
                                class="btn btn-primary w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white border-none"
                            >
                                {currentQuestionIndex() + 1 === shuffledQuestions().length ? 'Fin du Quizz' : 'Prochaine Question'}
                            </button>
                        </Show>
                    </Show>
                </Show>
            </div>
        </div>
    );
};

export default Quizz;
