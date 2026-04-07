-- 007: Seed all 23 achievements (14 HSK-1 + 9 HSK-2)

DELETE FROM public.achievements;

INSERT INTO public.achievements (code, title_uz, description_uz, xp_reward, condition_type, condition_value, icon) VALUES
-- HSK 1 Achievements (14)
('first_step', 'Birinchi Qadam', 'Birinchi darsni tugatdingiz!', 50, 'lesson_complete', 1, 'footprints'),
('streak_3', '3 Kun Izchil', '3 kun ketma-ket o''rgandingiz!', 30, 'streak', 3, 'flame'),
('streak_7', 'Haftalik Qahramonlik', '7 kun ketma-ket o''rgandingiz!', 70, 'streak', 7, 'flame'),
('streak_30', 'Oylik Master', '30 kun to''xtamay o''rgandingiz!', 200, 'streak', 30, 'crown'),
('vocab_50', '50 So''z', '50 ta so''z o''rgandingiz!', 50, 'vocab_learned', 50, 'book-open'),
('vocab_100', '100 So''z', '100 ta so''z o''rgandingiz!', 100, 'vocab_learned', 100, 'book-open'),
('vocab_500', 'Lug''at Qahramoni', '500 ta so''z o''rgandingiz!', 300, 'vocab_learned', 500, 'trophy'),
('hsk1_complete', 'HSK 1 Bitiruvchi', 'HSK 1 barcha darslarini tugatdingiz!', 200, 'level_complete', 1, 'graduation-cap'),
('quiz_perfect', 'Mukammal Natija', 'Biror quizda 100% to''pladingiz!', 50, 'quiz_perfect', 100, 'star'),
('early_bird', 'Erta Turuvchi', 'Ertalab 7 dan oldin o''rgandingiz!', 20, 'time_of_day', 7, 'sun'),
('night_owl', 'Tungi Boyqush', 'Kechasi 23:00 dan keyin o''rgandingiz!', 20, 'time_of_day', 23, 'moon'),
('xp_1000', 'XP Yig''uvchi', '1000 XP to''pladingiz!', 100, 'xp', 1000, 'zap'),
('xp_5000', 'XP Ustasi', '5000 XP to''pladingiz!', 300, 'xp', 5000, 'zap'),
('premium_member', 'Premium A''zo', 'Premium obunani yoqdingiz!', 100, 'subscription', 1, 'crown'),

-- HSK 2 Achievements (9)
('hsk2_vocab_50', 'HSK2 Boshlovchi', 'HSK 2 dan 50 ta so''z o''rgandingiz!', 75, 'hsk2_vocab', 50, 'book-open'),
('hsk2_vocab_100', 'HSK2 O''rta', 'HSK 2 dan 100 ta so''z o''rgandingiz!', 150, 'hsk2_vocab', 100, 'book-open'),
('hsk2_vocab_150', 'HSK2 So''z Ustasi', 'HSK 2 barcha 150 so''zini o''rgandingiz!', 250, 'hsk2_vocab', 150, 'trophy'),
('hsk2_complete', 'HSK 2 Bitiruvchi', 'HSK 2 barcha darslarini tugatdingiz!', 400, 'level_complete', 2, 'graduation-cap'),
('direction_master', 'Yo''l Ustasi', 'Yo''nalish darsini 100% bilan o''tdingiz!', 50, 'lesson_perfect', 1, 'compass'),
('sportsman', 'Sportchi', 'Sport darsini tugatdingiz!', 50, 'lesson_complete_sport', 1, 'dumbbell'),
('traveler', 'Sayohatsever', 'Transport darsini tugatdingiz!', 75, 'lesson_complete_transport', 1, 'plane'),
('quiz_streak_5', '5 Quiz Ketma-ket', '5 ta quizni ketma-ket o''tdingiz!', 100, 'quiz_streak', 5, 'target'),
('grammar_hero', 'Grammatika Qahramoni', '10 ta grammatika darsini tugatdingiz!', 150, 'grammar_lessons', 10, 'brain');
