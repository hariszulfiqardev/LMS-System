<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuizRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'title' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'duration' => ['required', 'integer', 'min:10', 'max:30'],
            'mcqs' => 'required|array|min:1',
            'mcqs.*.question' => 'required|string',
            'mcqs.*.options' => 'required|array|min:1',
            'mcqs.*.options.*.text' => 'required|string',
            'mcqs.*.correctOption' => 'required|integer|min:0'
        ];
    }

    public function messages(): array
    {
        return [
            'mcqs.required' => 'At least one MCQ is required.',
            'mcqs.min' => 'At least one MCQ is required.',
            'mcqs.*.question.required' => 'Each MCQ must have a question.',
            'mcqs.*.options.required' => 'Each MCQ must have at least one option.',
            'mcqs.*.options.min' => 'Each MCQ must have at least one option.',
            'mcqs.*.options.*.text.required' => 'Each option must have text.',
            'mcqs.*.correctOption.required' => 'Each MCQ must have a correct option specified.',
            'mcqs.*.correctOption.integer' => 'The correct option must be a valid option index.',
            'mcqs.*.correctOption.min' => 'The correct option must be a valid option index.'
        ];
    }
}
