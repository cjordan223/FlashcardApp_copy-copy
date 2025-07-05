# Security+ Flashcard App

A React-based flashcard application for studying CompTIA Security+ exam material. The app includes both acronym/terminology practice and comprehensive exam questions.

## Features

- **Deck Selection**: Choose between Acronyms and Practice Exams
- **Interactive Flashcards**: Answer questions with immediate feedback
- **Progress Tracking**: See your progress through the quiz
- **Score Tracking**: Track your score and see results at the end
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple Choice Support**: Handles both single and multiple choice questions

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

## Usage

1. **Select a Deck**: Choose between "Acronyms" or "Practice Exams"
2. **Answer Questions**: Click on your chosen answer(s)
3. **Get Feedback**: See immediate feedback on correct/incorrect answers
4. **Navigate**: Use Previous/Next buttons to move through questions
5. **View Results**: See your final score and percentage at the end

## File Structure

```
├── public/
│   └── index.html
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
├── Acronyms/
│   ├── acs1.json
│   ├── acs2.json
│   └── ...
├── Exams/
│   ├── exam1.json
│   ├── exam2.json
│   └── ...
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
      "correct_answers": ["Option A"]
    }
  ]
}
```

For multiple choice questions, `correct_answers` can contain multiple options.

## Technologies Used

- React 18
- Express.js (for serving JSON files)
- CSS3 with modern features (Grid, Flexbox, Animations)
- Responsive design principles

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is for educational purposes. 