import { Question } from '../types/game';

export const TARGET_SECRET_LETTERS = ['P', 'H', 'U', 'N', 'U', 'V', 'I', 'E', 'T', 'N', 'A', 'M'] as const;

export const SECRET_WORD = TARGET_SECRET_LETTERS.join(''); // "PHUNUVIETNAM"

// Thứ tự chữ cái trao thưởng cho 12 câu hỏi được xáo trộn ngẫu nhiên để học sinh không đoán sớm được từ khóa
export const SCRAMBLED_QUESTION_LETTERS = ['T', 'N', 'U', 'M', 'V', 'A', 'H', 'I', 'N', 'E', 'U', 'P'] as const;

export const GAME_QUESTIONS: Question[] = [
  {
    id: 1,
    topic: "Khái niệm số nguyên tố",
    categoryTag: "Số nguyên tố",
    text: "Số nguyên tố là số tự nhiên lớn hơn 1 có bao nhiêu ước?",
    options: ["1", "2", "3", "Nhiều hơn 3"],
    correctIndex: 1,
    hint: "Số nguyên tố chỉ chia hết cho 1 và chính nó, vì vậy có đúng hai ước."
  },
  {
    id: 2,
    topic: "Ước của số nguyên tố",
    categoryTag: "Số nguyên tố",
    text: "Hai ước của một số nguyên tố là:",
    options: ["0 và chính nó", "1 và 2", "1 và chính nó", "2 và chính nó"],
    correctIndex: 2,
    hint: "Mọi số nguyên tố p chỉ có đúng hai ước tự nhiên là 1 và chính nó."
  },
  {
    id: 3,
    topic: "Khái niệm hợp số",
    categoryTag: "Hợp số",
    text: "Hợp số là số tự nhiên lớn hơn 1 có:",
    options: ["Đúng một ước", "Đúng hai ước", "Nhiều hơn hai ước", "Không có ước"],
    correctIndex: 2,
    hint: "Hợp số lớn hơn 1 và ngoài 1 và chính nó còn có ước khác (tức nhiều hơn hai ước)."
  },
  {
    id: 4,
    topic: "Nhận biết số nguyên tố cơ bản",
    categoryTag: "Nhận biết số nguyên tố",
    text: "Số nào sau đây là số nguyên tố?",
    options: ["4", "5", "6", "8"],
    correctIndex: 1,
    hint: "Số 5 chỉ có hai ước là 1 và 5, nên 5 là số nguyên tố."
  },
  {
    id: 5,
    topic: "Nhận biết hợp số cơ bản",
    categoryTag: "Hợp số",
    text: "Số nào sau đây là hợp số?",
    options: ["2", "3", "7", "9"],
    correctIndex: 3,
    hint: "Số 9 chia hết cho 1; 3; 9 (có 3 ước) nên 9 là hợp số."
  },
  {
    id: 6,
    topic: "Đặc điểm của số 0 và số 1",
    categoryTag: "Đặc điểm số 0 và 1",
    text: "Khẳng định nào đúng về số 0 và số 1?",
    options: [
      "Số 1 là số nguyên tố, số 0 là hợp số",
      "Số 0 và số 1 đều là hợp số",
      "Không là số nguyên tố và cũng không là hợp số",
      "Số 1 là hợp số, số 0 là số nguyên tố"
    ],
    correctIndex: 2,
    hint: "Ghi nhớ SGK Toán 6: Số 0 và số 1 không là số nguyên tố và cũng không là hợp số."
  },
  {
    id: 7,
    topic: "Nhận biết số 17 và số ước",
    categoryTag: "Nhận biết số nguyên tố",
    text: "Vì sao số 17 là số nguyên tố?",
    options: [
      "Vì 17 là số lẻ",
      "Vì chỉ có đúng hai ước là 1 và 17",
      "Vì không chia hết cho 2",
      "Vì 17 lớn hơn 10"
    ],
    correctIndex: 1,
    hint: "Số 17 chỉ chia hết cho 1 và 17 (đúng hai ước) nên 17 là số nguyên tố."
  },
  {
    id: 8,
    topic: "Dấu hiệu chia hết nhận biết hợp số",
    categoryTag: "Dấu hiệu chia hết",
    text: "Dựa vào dấu hiệu chia hết, số 1975 khẳng định là hợp số vì nó:",
    options: ["Chia hết cho 2", "Chia hết cho 3", "Chia hết cho 5", "Chia hết cho 10"],
    correctIndex: 2,
    hint: "Chữ số tận cùng là 5 nên 1975 chia hết cho 5, nghĩa là có nhiều hơn hai ước."
  },
  {
    id: 9,
    topic: "Chọn số nguyên tố trong các số cho trước",
    categoryTag: "Nhận biết số nguyên tố",
    text: "Trong các số: 21, 23, 27, 33, số nào là số nguyên tố?",
    options: ["21", "23", "27", "33"],
    correctIndex: 1,
    hint: "21 chia hết cho 3, 27 chia hết cho 3, 33 chia hết cho 3. Chỉ có 23 là số nguyên tố."
  },
  {
    id: 10,
    topic: "Tính chất số chẵn lớn hơn 2",
    categoryTag: "Tính chất số chẵn",
    text: "Trong các số: 2, 5, 7, 2017, 2018, số nào chắc chắn là hợp số do là số chẵn lớn hơn 2?",
    options: ["2", "5", "2017", "2018"],
    correctIndex: 3,
    hint: "Mọi số chẵn lớn hơn 2 đều có ít nhất ba ước là 1, 2 và chính nó nên chắc chắn là hợp số."
  },
  {
    id: 11,
    topic: "Số nguyên tố chẵn duy nhất",
    categoryTag: "Số nguyên tố đặc biệt",
    text: "Số nguyên tố chẵn duy nhất là:",
    options: ["0", "1", "2", "4"],
    correctIndex: 2,
    hint: "Số 2 là số nguyên tố nhỏ nhất và cũng là số nguyên tố chẵn duy nhất."
  },
  {
    id: 12,
    topic: "Nhận biết khẳng định đúng về số nguyên tố",
    categoryTag: "Số nguyên tố đặc biệt",
    text: "Khẳng định nào sau đây là đúng?",
    options: [
      "Mọi số lẻ đều là số nguyên tố",
      "Mọi số chẵn đều là hợp số",
      "Số 2 là số nguyên tố",
      "Số 1 là số nguyên tố"
    ],
    correctIndex: 2,
    hint: "Số 2 có đúng hai ước là 1 và 2 nên 2 là số nguyên tố."
  }
];
