<?php

namespace App\Exports;

use App\Models\QuizAttempt;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class UserQuizReportExport implements FromCollection, WithHeadings, ShouldAutoSize, WithStyles
{
    protected $userId;

    public function __construct($userId)
    {
        $this->userId = $userId;
    }

    public function collection()
    {
        return QuizAttempt::where('user_id', $this->userId)
            ->select('course_title', 'quiz_title', 'status', 'duration', 'total_questions', 'correct_questions', 'score')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Course Name',
            'Quiz Title',
            'Status',
            'Duration',
            'Total Questions',
            'Correct Answers',
            'Score'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1    => ['font' => ['bold' => true]],
        ];
    }
}
