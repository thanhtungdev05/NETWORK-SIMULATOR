<?php
declare(strict_types=1);

use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

const FTC_REPORT_XLSX_VERSION = 'FTC-XLSX-1.0';
const FTC_REPORT_XLSX_MAX_ROWS = 10000;
const FTC_REPORT_XLSX_MAX_COLUMNS = 180;
const FTC_REPORT_XLSX_MAX_CELLS = 150000;
const FTC_REPORT_XLSX_MAX_METADATA = 24;
const FTC_REPORT_XLSX_MAX_CELL_LENGTH = 32767;

function ftc_report_xlsx_catalog(): array
{
    return [
        'activity' => [
            'title' => 'FTC - BÁO CÁO CHI TIẾT HOẠT ĐỘNG KTV',
            'filename' => 'FTC_Chi_tiet_hoat_dong_KTV',
            'freeze' => 'F5',
        ],
        'region' => [
            'title' => 'FTC - BÁO CÁO TIẾN ĐỘ THỰC HÀNH THEO CHI NHÁNH',
            'filename' => 'FTC_Tien_do_theo_chi_nhanh',
            'freeze' => 'C5',
        ],
        'class_matrix' => [
            'title' => 'FTC - BÁO CÁO TIẾN ĐỘ KTV THEO LỚP',
            'filename' => 'FTC_Tien_do_KTV_theo_lop',
            'freeze' => 'G5',
        ],
        'roster' => [
            'title' => 'FTC - BÁO CÁO DANH SÁCH HỒ SƠ KTV',
            'filename' => 'FTC_Danh_sach_KTV',
            'freeze' => 'D5',
        ],
    ];
}

function ftc_report_xlsx_clean_text(mixed $value, int $maximumLength = FTC_REPORT_XLSX_MAX_CELL_LENGTH): string
{
    if ($value !== null && !is_scalar($value) && !($value instanceof Stringable)) {
        throw new InvalidArgumentException('Dữ liệu văn bản của báo cáo không hợp lệ.');
    }
    $text = (string)($value ?? '');
    $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text) ?? '';
    if (mb_strlen($text, 'UTF-8') > $maximumLength) {
        throw new InvalidArgumentException('Một ô dữ liệu vượt quá giới hạn ký tự của Excel.');
    }
    return $text;
}

function ftc_report_xlsx_required_text(array $input, string $key, int $maximumLength): string
{
    $value = trim(ftc_report_xlsx_clean_text($input[$key] ?? '', $maximumLength));
    if ($value === '') {
        throw new InvalidArgumentException("Thiếu trường bắt buộc: $key.");
    }
    return $value;
}

function ftc_report_xlsx_optional_text(array $input, string $key, int $maximumLength, string $fallback = ''): string
{
    if (!array_key_exists($key, $input) || $input[$key] === null) {
        return $fallback;
    }
    return trim(ftc_report_xlsx_clean_text($input[$key], $maximumLength));
}

function ftc_report_xlsx_normalize_scalar(mixed $value): string|int|float|bool|null
{
    if ($value === null || is_string($value) || is_int($value) || is_float($value) || is_bool($value)) {
        if (is_string($value)) {
            return ftc_report_xlsx_clean_text($value);
        }
        if (is_float($value) && !is_finite($value)) {
            throw new InvalidArgumentException('Dữ liệu báo cáo chứa số không hợp lệ.');
        }
        return $value;
    }
    throw new InvalidArgumentException('Mỗi ô báo cáo chỉ được chứa văn bản, số, boolean hoặc giá trị rỗng.');
}

function ftc_report_xlsx_safe_filename(string $base, DateTimeImmutable $generatedAt): string
{
    $base = preg_replace('/\.(csv|xlsx?)$/i', '', $base) ?? '';
    $base = preg_replace('/[^A-Za-z0-9._-]+/', '_', $base) ?? '';
    $base = trim(preg_replace('/_+/', '_', $base) ?? '', '._-');
    if ($base === '') {
        $base = 'FTC_Bao_cao';
    }
    $base = substr($base, 0, 100);
    if (!preg_match('/_\d{4}-\d{2}-\d{2}_\d{4}$/', $base)) {
        $base .= '_' . $generatedAt->format('Y-m-d_Hi');
    }
    return $base . '.xlsx';
}

function ftc_report_xlsx_actor_label(array $actor): string
{
    $name = trim((string)($actor['display_name'] ?? $actor['full_name'] ?? $actor['email'] ?? 'DEV'));
    $email = trim((string)($actor['email'] ?? ''));
    if ($email !== '' && strcasecmp($name, $email) !== 0) {
        return $name . ' (' . $email . ')';
    }
    return $name !== '' ? $name : 'DEV';
}

function ftc_report_xlsx_normalize_descriptor(
    array $input,
    array $actor,
    DateTimeZone $timezone
): array {
    $catalog = ftc_report_xlsx_catalog();
    $typeValue = $input['type'] ?? '';
    if (!is_string($typeValue)) {
        throw new InvalidArgumentException('Loại báo cáo không hợp lệ.');
    }
    $type = strtolower(trim($typeValue));
    if (!isset($catalog[$type])) {
        throw new InvalidArgumentException('Loại báo cáo không hợp lệ.');
    }

    $headersInput = $input['headers'] ?? null;
    $rowsInput = $input['rows'] ?? null;
    if (!is_array($headersInput) || $headersInput === []) {
        throw new InvalidArgumentException('Báo cáo phải có ít nhất một cột dữ liệu.');
    }
    if (!is_array($rowsInput)) {
        throw new InvalidArgumentException('Danh sách dòng báo cáo không hợp lệ.');
    }
    if (count($headersInput) > FTC_REPORT_XLSX_MAX_COLUMNS) {
        throw new InvalidArgumentException('Báo cáo có quá nhiều cột.');
    }
    if (count($rowsInput) > FTC_REPORT_XLSX_MAX_ROWS) {
        throw new InvalidArgumentException('Báo cáo có quá nhiều dòng.');
    }
    if (count($headersInput) * max(1, count($rowsInput)) > FTC_REPORT_XLSX_MAX_CELLS) {
        throw new InvalidArgumentException('Báo cáo vượt quá giới hạn số ô cho một lần xuất.');
    }

    $headers = [];
    $headerKeys = [];
    foreach ($headersInput as $header) {
        if (!is_scalar($header) && $header !== null) {
            throw new InvalidArgumentException('Tên cột báo cáo không hợp lệ.');
        }
        $text = trim(ftc_report_xlsx_clean_text($header, 300));
        if ($text === '') {
            throw new InvalidArgumentException('Tên cột báo cáo không được để trống.');
        }
        $key = mb_strtolower($text, 'UTF-8');
        if (isset($headerKeys[$key])) {
            throw new InvalidArgumentException("Tên cột bị trùng: $text.");
        }
        $headerKeys[$key] = true;
        $headers[] = $text;
    }

    $allowedColumnTypes = ['text', 'integer', 'number', 'percent', 'date', 'time', 'datetime', 'boolean'];
    $columnTypesInput = $input['columnTypes'] ?? [];
    if ($columnTypesInput !== [] && (!is_array($columnTypesInput) || count($columnTypesInput) !== count($headers))) {
        throw new InvalidArgumentException('Khai báo kiểu cột không khớp với số cột báo cáo.');
    }
    $columnTypes = [];
    foreach ($headers as $index => $_header) {
        $columnType = strtolower(trim((string)($columnTypesInput[$index] ?? 'text')));
        if (!in_array($columnType, $allowedColumnTypes, true)) {
            throw new InvalidArgumentException("Kiểu cột không hợp lệ: $columnType.");
        }
        $columnTypes[] = $columnType;
    }

    $rows = [];
    foreach ($rowsInput as $rowIndex => $row) {
        if (!is_array($row) || count($row) !== count($headers)) {
            $humanRow = $rowIndex + 1;
            throw new InvalidArgumentException("Dòng dữ liệu $humanRow không khớp với số cột.");
        }
        $rows[] = array_map('ftc_report_xlsx_normalize_scalar', array_values($row));
    }

    $metadataInput = $input['metadata'] ?? [];
    if (!is_array($metadataInput) || count($metadataInput) > FTC_REPORT_XLSX_MAX_METADATA) {
        throw new InvalidArgumentException('Thông tin mô tả báo cáo không hợp lệ.');
    }
    $metadata = [];
    foreach ($metadataInput as $item) {
        if (!is_array($item) || count($item) !== 2) {
            throw new InvalidArgumentException('Mỗi thông tin mô tả phải gồm nhãn và giá trị.');
        }
        $label = trim(ftc_report_xlsx_clean_text($item[0] ?? '', 150));
        $value = ftc_report_xlsx_clean_text($item[1] ?? '', 1500);
        if ($label !== '') {
            $metadata[] = [$label, $value];
        }
    }

    $generatedAt = new DateTimeImmutable('now', $timezone);
    $requestedFilename = ftc_report_xlsx_optional_text($input, 'filename', 140, $catalog[$type]['filename']);

    return [
        'type' => $type,
        'title' => $catalog[$type]['title'],
        'period' => ftc_report_xlsx_optional_text($input, 'period', 300, 'Dữ liệu hiện có'),
        'scope' => ftc_report_xlsx_optional_text($input, 'scope', 1200, 'Toàn hệ thống'),
        'headers' => $headers,
        'columnTypes' => $columnTypes,
        'rows' => $rows,
        'metadata' => $metadata,
        'freeze' => $catalog[$type]['freeze'],
        'filename' => ftc_report_xlsx_safe_filename($requestedFilename, $generatedAt),
        'generatedAt' => $generatedAt,
        'actorLabel' => ftc_report_xlsx_actor_label($actor),
    ];
}

function ftc_report_xlsx_date_value(mixed $value): ?float
{
    if ($value instanceof DateTimeInterface) {
        return ExcelDate::PHPToExcel($value);
    }
    $text = trim((string)($value ?? ''));
    if ($text === '') {
        return null;
    }
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $text, new DateTimeZone('UTC'));
    $errors = DateTimeImmutable::getLastErrors();
    $valid = $errors === false || ($errors['warning_count'] === 0 && $errors['error_count'] === 0);
    return $date && $valid && $date->format('Y-m-d') === $text ? ExcelDate::PHPToExcel($date) : null;
}

function ftc_report_xlsx_time_value(mixed $value): ?float
{
    $text = trim((string)($value ?? ''));
    if (!preg_match('/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/', $text, $matches)) {
        return null;
    }
    $hours = (int)$matches[1];
    $minutes = (int)$matches[2];
    $seconds = isset($matches[3]) ? (int)$matches[3] : 0;
    if ($hours > 23 || $minutes > 59 || $seconds > 59) {
        return null;
    }
    return ($hours * 3600 + $minutes * 60 + $seconds) / 86400;
}

function ftc_report_xlsx_write_typed_cell(
    Worksheet $sheet,
    string $coordinate,
    mixed $value,
    string $columnType
): void {
    if ($value === null || $value === '') {
        $sheet->setCellValueExplicit($coordinate, '', DataType::TYPE_STRING);
        return;
    }

    if ($columnType === 'date') {
        $excelValue = ftc_report_xlsx_date_value($value);
        if ($excelValue !== null) {
            $sheet->setCellValue($coordinate, $excelValue);
            $sheet->getStyle($coordinate)->getNumberFormat()->setFormatCode('dd/mm/yyyy');
            return;
        }
    } elseif ($columnType === 'time') {
        $excelValue = ftc_report_xlsx_time_value($value);
        if ($excelValue !== null) {
            $sheet->setCellValue($coordinate, $excelValue);
            $sheet->getStyle($coordinate)->getNumberFormat()->setFormatCode('hh:mm:ss');
            return;
        }
    } elseif ($columnType === 'datetime') {
        try {
            $date = new DateTimeImmutable((string)$value);
            $sheet->setCellValue($coordinate, ExcelDate::PHPToExcel($date));
            $sheet->getStyle($coordinate)->getNumberFormat()->setFormatCode('dd/mm/yyyy hh:mm:ss');
            return;
        } catch (Throwable) {
            // Keep malformed date values as explicit text below.
        }
    } elseif ($columnType === 'boolean') {
        $sheet->setCellValueExplicit($coordinate, (bool)$value, DataType::TYPE_BOOL);
        return;
    } elseif ($columnType === 'integer' && is_numeric($value)) {
        $sheet->setCellValueExplicit($coordinate, (int)$value, DataType::TYPE_NUMERIC);
        $sheet->getStyle($coordinate)->getNumberFormat()->setFormatCode('#,##0');
        return;
    } elseif ($columnType === 'number' && is_numeric($value)) {
        $sheet->setCellValueExplicit($coordinate, (float)$value, DataType::TYPE_NUMERIC);
        $sheet->getStyle($coordinate)->getNumberFormat()->setFormatCode('#,##0.00');
        return;
    } elseif ($columnType === 'percent' && is_numeric($value)) {
        $sheet->setCellValueExplicit($coordinate, (float)$value, DataType::TYPE_NUMERIC);
        $sheet->getStyle($coordinate)->getNumberFormat()->setFormatCode('0%');
        return;
    }

    $sheet->setCellValueExplicit(
        $coordinate,
        ftc_report_xlsx_clean_text($value),
        DataType::TYPE_STRING
    );
}

function ftc_report_xlsx_column_width(string $header, string $columnType, array $values): float
{
    $maximum = mb_strlen($header, 'UTF-8');
    foreach (array_slice($values, 0, 500) as $value) {
        $text = (string)($value ?? '');
        foreach (preg_split('/\R/u', $text) ?: [$text] as $line) {
            $maximum = max($maximum, mb_strlen($line, 'UTF-8'));
        }
    }
    $width = max(9, min(44, $maximum + 2));
    $normalizedHeader = mb_strtolower($header, 'UTF-8');
    if ($columnType === 'date') return 13;
    if ($columnType === 'time') return 11;
    if ($header === 'STT') return 8;
    if (str_contains($normalizedHeader, 'email')) return max(28, min(38, $width));
    if (str_contains($normalizedHeader, 'họ và tên')) return max(22, min(30, $width));
    if (str_contains($normalizedHeader, 'hành động')) return 44;
    if (str_contains($normalizedHeader, 'thiết bị') || str_contains($normalizedHeader, 'bài lab')) {
        return max(18, min(28, $width));
    }
    if ($columnType === 'integer' || $columnType === 'number' || $columnType === 'percent') {
        return max(11, min(16, $width));
    }
    return $width;
}

function ftc_report_xlsx_build(array $report): Spreadsheet
{
    $spreadsheet = new Spreadsheet();
    $spreadsheet->getProperties()
        ->setCreator($report['actorLabel'])
        ->setLastModifiedBy($report['actorLabel'])
        ->setTitle($report['title'])
        ->setSubject($report['scope'])
        ->setDescription('Báo cáo được sinh tự động bởi FTC Virtual Devices')
        ->setCategory('FTC Reports')
        ->setCreated($report['generatedAt']->getTimestamp())
        ->setModified($report['generatedAt']->getTimestamp());

    $reportSheet = $spreadsheet->getActiveSheet();
    $reportSheet->setTitle('Báo cáo');
    $reportSheet->setShowGridlines(false);
    $reportSheet->getSheetView()->setZoomScale(90);

    $columnCount = count($report['headers']);
    $lastColumn = Coordinate::stringFromColumnIndex($columnCount);
    $lastRow = max(4, count($report['rows']) + 4);

    $reportSheet->mergeCells("A1:{$lastColumn}1");
    $reportSheet->setCellValueExplicit('A1', $report['title'], DataType::TYPE_STRING);
    $reportSheet->getStyle("A1:{$lastColumn}1")->applyFromArray([
        'font' => ['name' => 'Aptos Display', 'size' => 17, 'bold' => true, 'color' => ['rgb' => 'FFFFFF']],
        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'C83D82']],
        'alignment' => ['horizontal' => Alignment::HORIZONTAL_LEFT, 'vertical' => Alignment::VERTICAL_CENTER],
    ]);
    $reportSheet->getRowDimension(1)->setRowHeight(32);

    $reportSheet->mergeCells("A2:{$lastColumn}2");
    $subtitle = 'Kỳ báo cáo: ' . $report['period'] . '  •  Phạm vi: ' . $report['scope'];
    $reportSheet->setCellValueExplicit('A2', $subtitle, DataType::TYPE_STRING);
    $reportSheet->getStyle("A2:{$lastColumn}2")->applyFromArray([
        'font' => ['name' => 'Aptos', 'size' => 10, 'color' => ['rgb' => '596579']],
        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F8EFF5']],
        'alignment' => ['horizontal' => Alignment::HORIZONTAL_LEFT, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
    ]);
    $reportSheet->getRowDimension(2)->setRowHeight(28);
    $reportSheet->getRowDimension(3)->setRowHeight(8);

    foreach ($report['headers'] as $index => $header) {
        $column = Coordinate::stringFromColumnIndex($index + 1);
        $reportSheet->setCellValueExplicit("{$column}4", $header, DataType::TYPE_STRING);
    }
    $reportSheet->getStyle("A4:{$lastColumn}4")->applyFromArray([
        'font' => ['name' => 'Aptos', 'size' => 10, 'bold' => true, 'color' => ['rgb' => 'FFFFFF']],
        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4F5D95']],
        'borders' => [
            'bottom' => ['borderStyle' => Border::BORDER_MEDIUM, 'color' => ['rgb' => '37436F']],
            'vertical' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '6F7BA8']],
        ],
        'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
    ]);
    $reportSheet->getRowDimension(4)->setRowHeight(38);

    foreach ($report['rows'] as $rowIndex => $row) {
        $excelRow = $rowIndex + 5;
        foreach ($row as $columnIndex => $value) {
            $column = Coordinate::stringFromColumnIndex($columnIndex + 1);
            ftc_report_xlsx_write_typed_cell(
                $reportSheet,
                "{$column}{$excelRow}",
                $value,
                $report['columnTypes'][$columnIndex]
            );
        }
    }

    if ($report['rows'] !== []) {
        $dataRange = "A5:{$lastColumn}{$lastRow}";
        $reportSheet->getStyle($dataRange)->applyFromArray([
            'font' => ['name' => 'Aptos', 'size' => 10, 'color' => ['rgb' => '263248']],
            'borders' => [
                'bottom' => ['borderStyle' => Border::BORDER_HAIR, 'color' => ['rgb' => 'DDE3EC']],
            ],
            'alignment' => ['vertical' => Alignment::VERTICAL_TOP, 'wrapText' => true],
        ]);
        for ($row = 6; $row <= $lastRow; $row += 2) {
            $reportSheet->getStyle("A{$row}:{$lastColumn}{$row}")
                ->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()
                ->setRGB('F8F9FC');
        }
    }

    foreach ($report['headers'] as $index => $header) {
        $column = Coordinate::stringFromColumnIndex($index + 1);
        $values = array_column($report['rows'], $index);
        $columnType = $report['columnTypes'][$index];
        $reportSheet->getColumnDimension($column)->setWidth(
            ftc_report_xlsx_column_width($header, $columnType, $values)
        );
        if ($report['rows'] !== []) {
            $alignment = in_array($columnType, ['integer', 'number', 'percent'], true)
                ? Alignment::HORIZONTAL_RIGHT
                : (in_array($columnType, ['date', 'time', 'datetime', 'boolean'], true)
                    ? Alignment::HORIZONTAL_CENTER
                    : Alignment::HORIZONTAL_LEFT);
            $reportSheet->getStyle("{$column}5:{$column}{$lastRow}")
                ->getAlignment()
                ->setHorizontal($alignment);
        }
    }

    $reportSheet->freezePane($report['freeze']);
    $reportSheet->setAutoFilter("A4:{$lastColumn}{$lastRow}");
    $reportSheet->setSelectedCell('A1');
    $reportSheet->getPageSetup()
        ->setOrientation(PageSetup::ORIENTATION_LANDSCAPE)
        ->setPaperSize(PageSetup::PAPERSIZE_A4)
        ->setFitToWidth(1)
        ->setFitToHeight(0);
    $reportSheet->getPageMargins()
        ->setTop(0.45)
        ->setRight(0.3)
        ->setBottom(0.45)
        ->setLeft(0.3);
    $reportSheet->getHeaderFooter()->setOddFooter('&LFTC Virtual Devices&CTrang &P / &N&R' . $report['generatedAt']->format('d/m/Y H:i'));

    $infoSheet = $spreadsheet->createSheet();
    $infoSheet->setTitle('Thông tin');
    $infoSheet->setShowGridlines(false);
    $infoSheet->getSheetView()->setZoomScale(100);
    $infoSheet->getColumnDimension('A')->setWidth(3);
    $infoSheet->getColumnDimension('B')->setWidth(27);
    $infoSheet->getColumnDimension('C')->setWidth(2);
    $infoSheet->getColumnDimension('D')->setWidth(70);
    $infoSheet->getColumnDimension('E')->setWidth(3);

    $infoSheet->mergeCells('B2:D3');
    $infoSheet->setCellValueExplicit('B2', $report['title'], DataType::TYPE_STRING);
    $infoSheet->getStyle('B2:D3')->applyFromArray([
        'font' => ['name' => 'Aptos Display', 'size' => 18, 'bold' => true, 'color' => ['rgb' => 'FFFFFF']],
        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'C83D82']],
        'alignment' => ['horizontal' => Alignment::HORIZONTAL_LEFT, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
    ]);
    $infoSheet->getRowDimension(2)->setRowHeight(28);
    $infoSheet->getRowDimension(3)->setRowHeight(20);

    $infoSheet->mergeCells('B5:D5');
    $infoSheet->setCellValueExplicit('B5', 'THÔNG TIN BÁO CÁO', DataType::TYPE_STRING);
    $infoSheet->getStyle('B5:D5')->applyFromArray([
        'font' => ['name' => 'Aptos', 'size' => 11, 'bold' => true, 'color' => ['rgb' => 'FFFFFF']],
        'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '6F4BA8']],
        'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
    ]);
    $infoSheet->getRowDimension(5)->setRowHeight(24);

    $summaryRows = [
        ['Phiên bản mẫu', FTC_REPORT_XLSX_VERSION],
        ['Loại báo cáo', $report['type']],
        ['Kỳ báo cáo', $report['period']],
        ['Phạm vi / bộ lọc', $report['scope']],
        ['Người xuất', $report['actorLabel']],
        ['Thời điểm xuất', $report['generatedAt']->format('d/m/Y H:i:s')],
        ['Số dòng dữ liệu', count($report['rows'])],
        ...$report['metadata'],
    ];
    $summaryStartRow = 6;
    foreach ($summaryRows as $index => [$label, $value]) {
        $row = $summaryStartRow + $index;
        $infoSheet->setCellValueExplicit("B{$row}", (string)$label, DataType::TYPE_STRING);
        if (is_int($value) || is_float($value)) {
            $infoSheet->setCellValueExplicit("D{$row}", $value, DataType::TYPE_NUMERIC);
            $infoSheet->getStyle("D{$row}")->getNumberFormat()->setFormatCode('#,##0');
        } else {
            $infoSheet->setCellValueExplicit("D{$row}", ftc_report_xlsx_clean_text($value), DataType::TYPE_STRING);
        }
        $infoSheet->getStyle("B{$row}")->applyFromArray([
            'font' => ['name' => 'Aptos', 'size' => 10, 'bold' => true, 'color' => ['rgb' => '39445A']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F8EFF5']],
            'borders' => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E8DDE5']]],
            'alignment' => ['vertical' => Alignment::VERTICAL_TOP, 'wrapText' => true],
        ]);
        $infoSheet->getStyle("C{$row}")->applyFromArray([
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'FFFFFF']],
            'borders' => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E8DDE5']]],
        ]);
        $infoSheet->getStyle("D{$row}")->applyFromArray([
            'font' => ['name' => 'Aptos', 'size' => 10, 'color' => ['rgb' => '263248']],
            'borders' => ['bottom' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E8DDE5']]],
            'alignment' => ['vertical' => Alignment::VERTICAL_TOP, 'wrapText' => true],
        ]);
        $infoSheet->getRowDimension($row)->setRowHeight(24);
    }
    $infoSheet->setSelectedCell('B2');
    $infoSheet->getPageSetup()->setPaperSize(PageSetup::PAPERSIZE_A4)->setFitToWidth(1)->setFitToHeight(1);
    $infoSheet->getPageMargins()->setTop(0.6)->setRight(0.5)->setBottom(0.6)->setLeft(0.5);

    $spreadsheet->setActiveSheetIndex(0);
    return $spreadsheet;
}

function ftc_report_xlsx_save(array $report): string
{
    $temporaryBase = tempnam(sys_get_temp_dir(), 'ftc-report-');
    if ($temporaryBase === false) {
        throw new RuntimeException('Không thể tạo file tạm cho báo cáo Excel.');
    }
    $path = $temporaryBase . '.xlsx';
    @unlink($temporaryBase);

    $spreadsheet = null;
    try {
        $spreadsheet = ftc_report_xlsx_build($report);
        $writer = new Xlsx($spreadsheet);
        $writer->setPreCalculateFormulas(false);
        $writer->save($path);
        if (!is_file($path) || filesize($path) === 0) {
            throw new RuntimeException('File Excel được tạo ra không hợp lệ.');
        }
        $zip = new ZipArchive();
        if ($zip->open($path) !== true) {
            throw new RuntimeException('Không thể kiểm tra cấu trúc file Excel.');
        }
        foreach (['[Content_Types].xml', 'xl/workbook.xml', 'xl/styles.xml', 'xl/worksheets/sheet1.xml', 'xl/worksheets/sheet2.xml'] as $entry) {
            if ($zip->locateName($entry) === false) {
                $zip->close();
                throw new RuntimeException("File Excel thiếu thành phần bắt buộc: $entry.");
            }
        }
        $zip->close();
        return $path;
    } catch (Throwable $exception) {
        @unlink($path);
        throw $exception;
    } finally {
        if ($spreadsheet instanceof Spreadsheet) {
            $spreadsheet->disconnectWorksheets();
        }
    }
}

function ftc_report_xlsx_stream(array $report): void
{
    $path = ftc_report_xlsx_save($report);
    try {
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_write_close();
        }
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        header_remove('Content-Type');
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . $report['filename'] . '"; filename*=UTF-8\'\'' . rawurlencode($report['filename']));
        header('Content-Length: ' . (string)filesize($path));
        header('Cache-Control: private, no-store, no-cache, must-revalidate');
        header('X-Content-Type-Options: nosniff');
        $result = readfile($path);
        if ($result === false) {
            throw new RuntimeException('Không thể truyền file Excel tới trình duyệt.');
        }
    } finally {
        @unlink($path);
    }
    exit;
}
