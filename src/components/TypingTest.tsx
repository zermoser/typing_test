import React, { useState, useEffect, useRef } from 'react';

interface TypingStats {
    wpm: number;
    totalWords: number;
    accuracy: number;
}

type Language = 'en' | 'th';

const TypingTest: React.FC = () => {
    const [language, setLanguage] = useState<Language>('en');
    const [currentSentence, setCurrentSentence] = useState<string>('');
    const [userInput, setUserInput] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(60);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [stats, setStats] = useState<TypingStats>({ wpm: 0, totalWords: 0, accuracy: 0 });
    const [startTime, setStartTime] = useState<number | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const intervalRef = useRef<number | null>(null);

    const sentences = {
        en: [
            "The quick brown fox jumps over the lazy dog.",
            "Technology has revolutionized the way we communicate and work.",
            "Practice makes perfect when learning new skills.",
            "Success is the result of preparation, hard work, and learning from failure.",
            "The beautiful sunset painted the sky in vibrant colors.",
            "The quick brown fox jumps over the lazy dog near the sparkling riverbank.",
            "Programming is the art of telling another human being what one wants the computer to do perfectly.",
            "In the midst of winter, I found there was, within me, an invincible summer that never fades.",
            "Life is what happens to you while you're busy making other plans for your bright future.",
            "The only way to do great work is to love what you do and never stop learning new things.",
            "Success is not final, failure is not fatal, it is the courage to continue that counts most.",
            "Technology is best when it brings people together and makes their lives easier and more meaningful.",
            "The future belongs to those who believe in the beauty of their dreams and endless aspirations."
        ],
        th: [
            "สวัสดีครับ วันนี้เป็นวันที่สวยงามมาก อากาศดี แสงแดดอ่อนโยน เหมาะสำหรับการออกกำลังกาย",
            "การเรียนรู้ภาษาไทยเป็นสิ่งที่น่าสนใจ เพราะมีความหมายที่ลึกซึ้งและวัฒนธรรมที่งดงาม",
            "ประเทศไทยมีความหลากหลายทางวัฒนธรรม อาหารอร่อย และผู้คนที่มีน้ำใจ ช่วยเหลือกันและกัน",
            "เทคโนโลยีในยุคปัจจุบันได้เปลี่ยนแปลงวิถีชีวิตของเราให้สะดวกสบายและเชื่อมต่อกันมากขึ้น",
            "การทำงานหนักและมีวินัยในตนเองจะนำไปสู่ความสำเร็จในชีวิตและความสุขที่แท้จริง",
            "ธรรมชาติของไทยมีความงดงาม ป่าไผ่เขียวขจี ลำธารใส และภูเขาที่สูงส่งเป็นที่ประทับใจ",
            "การอ่านหนังสือเป็นการลงทุนที่ดีที่สุด เพราะจะให้ความรู้และประสบการณ์ที่มีคุณค่า",
            "มิตรภาพที่แท้จริงคือสิ่งล้ำค่า ที่จะอยู่เคียงข้างเราในยามดีและยามเสียใจเสมอ",
            "การฝึกพิมพ์ช่วยให้เราทำงานได้เร็วขึ้น",
            "เทคโนโลยีเปลี่ยนแปลงวิถีชีวิตของเราอย่างมาก",
            "การเรียนรู้สิ่งใหม่ต้องใช้ความอดทนและความพยายาม",
            "ความสำเร็จมาจากการเตรียมตัวและการทำงานหนัก",
            "ฟ้าช่วงเย็นมีสีสวยงามและสดใส"
        ]
    };

    const translations = {
        en: {
            title: "⚡ Typing Speed Test",
            subtitle: "Test your typing speed and accuracy in 60 seconds",
            timeLeft: "Time Left",
            wpm: "WPM",
            accuracy: "Accuracy",
            ready: "Ready to test your typing speed?",
            description: "Click start to begin the 60-second typing challenge!",
            startTest: "Start Test",
            placeholder: "Start typing here...",
            complete: "Test Complete!",
            wordsPerMinute: "Words Per Minute",
            totalWords: "Total Words",
            accuracyLabel: "Accuracy",
            tryAgain: "Try Again",
            language: "Language"
        },
        th: {
            title: "⚡ ทดสอบความเร็วการพิมพ์",
            subtitle: "ทดสอบความเร็วและความแม่นยำในการพิมพ์ใน 60 วินาที",
            timeLeft: "เวลาคงเหลือ",
            wpm: "คำ/นาที",
            accuracy: "ความแม่นยำ",
            ready: "พร้อมที่จะทดสอบความเร็วการพิมพ์แล้วไหม?",
            description: "คลิกเริ่มเพื่อเริ่มการทดสอบ 60 วินาที!",
            startTest: "เริ่มทดสอบ",
            placeholder: "เริ่มพิมพ์ที่นี่...",
            complete: "ทดสอบเสร็จสิ้น!",
            wordsPerMinute: "คำต่อนาที",
            totalWords: "จำนวนคำทั้งหมด",
            accuracyLabel: "ความแม่นยำ",
            tryAgain: "ลองอีกครั้ง",
            language: "ภาษา"
        }
    };

    const t = translations[language];

    const getRandomSentence = (): string => {
        const sentenceList = sentences[language];
        return sentenceList[Math.floor(Math.random() * sentenceList.length)];
    };

    const startTest = () => {
        const newSentence = getRandomSentence();
        setCurrentSentence(newSentence);
        setUserInput('');
        setTimeLeft(60);
        setIsActive(true);
        setIsCompleted(false);
        setStartTime(Date.now());

        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const resetTest = () => {
        setCurrentSentence('');
        setUserInput('');
        setTimeLeft(60);
        setIsActive(false);
        setIsCompleted(false);
        setStats({ wpm: 0, totalWords: 0, accuracy: 0 });
        setStartTime(null);

        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
        }
    };

    const calculateStats = (input: string, sentence: string, elapsedTimeMinutes: number): TypingStats => {
        const words = input.trim().split(/\s+/).filter(word => word.length > 0);
        const totalWords = words.length;
        const wpm = Math.round(totalWords / elapsedTimeMinutes);

        let correctChars = 0;
        const minLength = Math.min(input.length, sentence.length);

        for (let i = 0; i < minLength; i++) {
            if (input[i] === sentence[i]) {
                correctChars++;
            }
        }

        const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 0;

        return { wpm: Math.max(0, wpm), totalWords, accuracy };
    };

    const finishTest = () => {
        setIsActive(false);
        setIsCompleted(true);

        if (startTime) {
            const elapsedTime = (Date.now() - startTime) / 1000 / 60;
            const finalStats = calculateStats(userInput, currentSentence, elapsedTime);
            setStats(finalStats);
        }

        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
        }
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        finishTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
            }
        };
    }, [isActive, timeLeft]);

    useEffect(() => {
        if (isActive && userInput.length > 0 && userInput === currentSentence) {
            finishTest();
        }
    }, [userInput, currentSentence, isActive]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isActive) return;

        const value = e.target.value;
        if (value.length <= currentSentence.length) {
            setUserInput(value);
        }
    };

    const renderHighlightedText = () => {
        return currentSentence.split('').map((char, index) => {
            let className = 'text-gray-400 transition-all duration-150';

            if (index < userInput.length) {
                className = userInput[index] === char
                    ? 'text-emerald-600 bg-emerald-50 shadow-sm border border-emerald-200'
                    : 'text-rose-600 bg-rose-50 shadow-sm border border-rose-200';
            } else if (index === userInput.length) {
                className = 'text-gray-800 bg-gradient-to-r from-blue-200 to-purple-200 animate-pulse shadow-md border border-blue-300';
            }

            return (
                <span key={index} className={`${className} px-0.5 py-0.5 sm:px-1 rounded-md mx-0.5 font-medium text-sm sm:text-base md:text-lg`}>
                    {char}
                </span>
            );
        });
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-400/10 to-indigo-400/10 rounded-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
            </div>

            <div className="w-full max-w-4xl mx-auto relative z-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 md:p-8 relative overflow-hidden">
                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-2xl sm:rounded-3xl"></div>

                    <div className="relative z-10">
                        {/* Header with Language Selector */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
                            <div className="text-center flex-1 order-2 sm:order-1">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-3 py-2 sm:py-4">
                                    {t.title}
                                </h1>
                                <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium px-2">{t.subtitle}</p>
                            </div>

                            <div className="flex flex-col items-center sm:items-end order-1 sm:order-2">
                                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{t.language}</label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as Language)}
                                    className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:border-indigo-500 min-w-0"
                                >
                                    <option value="en">🇺🇸 English</option>
                                    <option value="th">🇹🇭 ไทย</option>
                                </select>
                            </div>
                        </div>

                        {/* Timer and Stats Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/30 shadow-lg">
                            <div className="text-center">
                                <div className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r ${timeLeft <= 10 ? 'from-red-500 to-orange-500' : 'from-blue-600 to-indigo-600'} bg-clip-text text-transparent`}>
                                    {formatTime(timeLeft)}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 font-medium">{t.timeLeft}</div>
                            </div>

                            {isActive && startTime && (
                                <div className="flex gap-4 sm:gap-8">
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                                            {calculateStats(userInput, currentSentence, (Date.now() - startTime) / 1000 / 60).wpm}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-600 font-medium">{t.wpm}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                                            {calculateStats(userInput, currentSentence, (Date.now() - startTime) / 1000 / 60).accuracy}%
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-600 font-medium">{t.accuracy}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Main Content */}
                        {!isActive && !isCompleted && (
                            <div className="text-center py-8 sm:py-12 md:py-16">
                                <div className="mb-6 sm:mb-10">
                                    <div className="text-4xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 animate-bounce">🚀</div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 px-4">{t.ready}</h2>
                                    <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-10 px-4">{t.description}</p>
                                </div>
                                <button
                                    onClick={startTest}
                                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 shadow-xl touch-manipulation"
                                >
                                    {t.startTest}
                                </button>
                            </div>
                        )}

                        {isActive && (
                            <div className="space-y-4 sm:space-y-6 md:space-y-8">
                                {/* Text Display */}
                                <div className="bg-gradient-to-br from-gray-50/90 to-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 shadow-inner">
                                    <div className={`leading-relaxed sm:leading-loose ${language === 'th' ? 'font-thai' : 'font-mono'} break-words`}>
                                        {renderHighlightedText()}
                                    </div>
                                </div>

                                {/* Input Field */}
                                <div>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={userInput}
                                        onChange={handleInputChange}
                                        className={`w-full p-4 sm:p-5 md:p-6 text-base sm:text-lg md:text-xl border-2 sm:border-3 border-gray-300 rounded-xl sm:rounded-2xl focus:border-indigo-500 focus:outline-none transition-all duration-300 ${language === 'th' ? 'font-thai' : 'font-mono'} bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl focus:shadow-2xl touch-manipulation`}
                                        placeholder={t.placeholder}
                                        disabled={!isActive}
                                        autoComplete="off"
                                        autoCorrect="off"
                                        autoCapitalize="off"
                                        spellCheck="false"
                                    />
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 shadow-inner overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 sm:h-4 rounded-full transition-all duration-500 shadow-lg"
                                        style={{ width: `${(userInput.length / currentSentence.length) * 100}%` }}
                                    ></div>
                                </div>

                                {/* Mobile-friendly current progress indicator */}
                                <div className="text-center sm:hidden">
                                    <span className="text-sm text-gray-600 font-medium">
                                        {userInput.length} / {currentSentence.length} characters
                                    </span>
                                </div>
                            </div>
                        )}

                        {isCompleted && (
                            <div className="text-center py-8 sm:py-12">
                                <div className="mb-6 sm:mb-10">
                                    <div className="text-4xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 animate-bounce">🎉</div>
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 sm:mb-8 px-4">{t.complete}</h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-10">
                                        <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-1 sm:mb-2">{stats.wpm}</div>
                                            <div className="text-emerald-700 font-semibold text-sm sm:text-base md:text-lg">{t.wordsPerMinute}</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1 sm:mb-2">{stats.totalWords}</div>
                                            <div className="text-blue-700 font-semibold text-sm sm:text-base md:text-lg">{t.totalWords}</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2">{stats.accuracy}%</div>
                                            <div className="text-purple-700 font-semibold text-sm sm:text-base md:text-lg">{t.accuracyLabel}</div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={resetTest}
                                    className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-xl sm:rounded-2xl text-base sm:text-lg md:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 shadow-xl touch-manipulation"
                                >
                                    {t.tryAgain}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypingTest;