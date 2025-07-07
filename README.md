# Security+ Flashcard App

A React-based flashcard application for studying CompTIA Security+ exam material. The app includes both acronym/terminology practice and comprehensive exam questions with enhanced features for an optimal study experience.

## Features

- **Enhanced Deck Selection**: Choose from 10 Acronym Sets and 24 Practice Exams with question counts
- **Interactive Flashcards**: Answer questions with immediate feedback and explanations
- **Progress Tracking**: Visual progress bar and question navigation
- **Score Tracking**: Track your score and see detailed results at the end
- **Exam Review Mode**: Review all questions with correct/incorrect indicators
- **Mobile-First Design**: Optimized for touch devices with swipe gestures
- **Multiple Choice Support**: Handles both single and multiple choice questions
- **Swipe Navigation**: Swipe left/right to navigate between questions
- **Question Explanations**: Detailed explanations for incorrect answers
- **Collapsible Sections**: Organized deck selection with expandable categories

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Development Mode**:
   ```bash
   npm start
   ```
   This will start the React development server on `http://localhost:3000`

3. **Production Mode**:
   ```bash
   npm run build
   npm run server
   ```
   This will build the app and start the production server on `http://localhost:3000`

4. **Quick Development**:
   ```bash
   npm run dev
   ```
   This builds and serves the production version in one command

## Usage

1. **Select a Deck**: Choose from Acronym Sets (10 decks) or Practice Exams (24 decks)
2. **Answer Questions**: Click on your chosen answer(s) - multiple choice questions will auto-submit when the correct number is selected
3. **Get Feedback**: See immediate feedback with explanations for incorrect answers
4. **Navigate**: Use Previous/Next buttons or swipe gestures to move through questions
5. **Review Results**: See your final score and review all questions with correct/incorrect indicators
6. **Try Again**: Restart the same deck or choose a different one

## File Structure

```
├── public/
│   ├── index.html
│   ├── acs1.json - acs10.json (Acronym Sets)
│   └── exam1.json - exam24.json (Practice Exams)
├── src/
│   ├── components/
│   │   ├── DeckSelector.js
│   │   ├── DeckSelector.css
│   │   ├── Flashcard.js
│   │   ├── Flashcard.css
│   │   ├── ProgressBar.js
│   │   └── ProgressBar.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── server.js
└── README.md
```

## Data Format

The JSON files follow this structure:

```json
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answers": ["Option A"],
      "explanation": "Optional explanation for the correct answer"
    }
  ]
}
```

For multiple choice questions, `correct_answers` can contain multiple options. The `explanation` field is optional and provides additional context for the answer.

## Technologies Used

- React 18
- Express.js (for serving JSON files)
- React Icons (for UI icons)
- React Swipeable (for touch gestures)
- CSS3 with modern features (Grid, Flexbox, Animations)
- Mobile-first responsive design

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Key Improvements

- **Enhanced UI/UX**: Modern, mobile-first design with improved visual feedback
- **Touch Support**: Swipe gestures for navigation on mobile devices
- **Better Organization**: Collapsible sections for deck selection
- **Question Explanations**: Educational explanations for incorrect answers
- **Progress Indicators**: Visual progress tracking and question counts
- **Exam Review**: Comprehensive review mode showing all questions and answers
- **Performance**: Optimized loading and rendering for large question sets

## License

This project is for educational purposes. 