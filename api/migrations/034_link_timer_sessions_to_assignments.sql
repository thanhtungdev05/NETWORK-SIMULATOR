-- 034: Preserve explicit attribution from a submitted timer session to every
-- effective KTV-lab assignment. A session may legitimately satisfy the same
-- lab in multiple overlapping classes, so this is a many-to-many relation.

CREATE TABLE IF NOT EXISTS timer_session_assignment_links (
    timer_session_id BIGINT NOT NULL,
    assignment_id UUID NOT NULL,
    link_source VARCHAR(30) NOT NULL DEFAULT 'live_sync',
    linked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT timer_session_assignment_links_pkey
        PRIMARY KEY (timer_session_id, assignment_id),
    CONSTRAINT timer_session_assignment_links_timer_fkey
        FOREIGN KEY (timer_session_id) REFERENCES timer_sessions(id) ON DELETE CASCADE,
    CONSTRAINT timer_session_assignment_links_assignment_fkey
        FOREIGN KEY (assignment_id) REFERENCES lab_assignments(assignment_id) ON DELETE RESTRICT,
    CONSTRAINT timer_session_assignment_links_source_check
        CHECK (link_source IN ('live_sync', 'historical_effective'))
);

CREATE INDEX IF NOT EXISTS idx_timer_assignment_links_assignment
    ON timer_session_assignment_links (assignment_id, timer_session_id);

COMMENT ON TABLE timer_session_assignment_links IS
    'Explicit attribution of a timer session to every effective assignment for its KTV-lab pair.';

-- Backfill only when the recorded session time falls inside the complete
-- enrollment, class, class-assignment and individual-assignment windows.
-- Sessions without a defensible match remain unlinked instead of being guessed.
INSERT INTO timer_session_assignment_links (
    timer_session_id, assignment_id, link_source, linked_at
)
SELECT timer.id,
       assignment.assignment_id,
       'historical_effective',
       NOW()
  FROM timer_sessions timer
  JOIN class_enrollments enrollment
    ON enrollment.user_id = timer.user_id
   AND enrollment.status <> 'withdrawn'
   AND enrollment.is_mock = FALSE
   AND enrollment.valid_from <= COALESCE(timer.finished_at, timer.started_at, timer.created_at)::date
   AND (
       enrollment.valid_to IS NULL
       OR enrollment.valid_to >= COALESCE(timer.finished_at, timer.started_at, timer.created_at)::date
   )
  JOIN training_classes training
    ON training.class_id = enrollment.class_id
   AND training.is_mock = FALSE
   AND training.start_date <= COALESCE(timer.finished_at, timer.started_at, timer.created_at)::date
   AND (
       training.end_date IS NULL
       OR training.end_date >= COALESCE(timer.finished_at, timer.started_at, timer.created_at)::date
   )
  JOIN lab_assignments assignment
    ON assignment.enrollment_id = enrollment.enrollment_id
   AND assignment.status <> 'waived'
   AND assignment.assigned_at <= COALESCE(timer.finished_at, timer.started_at, timer.created_at)
   AND (
       assignment.due_at IS NULL
       OR assignment.due_at >= COALESCE(timer.finished_at, timer.started_at, timer.created_at)
   )
  JOIN curriculum_labs curriculum_lab
    ON curriculum_lab.curriculum_lab_id = assignment.curriculum_lab_id
   AND curriculum_lab.lab_id = timer.lab_id
  LEFT JOIN class_lab_assignments class_assignment
    ON class_assignment.class_lab_assignment_id = assignment.class_lab_assignment_id
 WHERE timer.user_id IS NOT NULL
   AND timer.mode IN ('Thực hành', 'practice')
   AND timer.status IN ('completed', 'failed')
   AND NOT COALESCE(timer.is_mock, FALSE)
   AND (
       class_assignment.class_lab_assignment_id IS NULL
       OR (
           class_assignment.status IN ('assigned', 'active', 'closed')
            AND class_assignment.assigned_at <= COALESCE(timer.finished_at, timer.started_at, timer.created_at)
           AND (
               class_assignment.due_at IS NULL
                OR class_assignment.due_at >= COALESCE(timer.finished_at, timer.started_at, timer.created_at)
           )
       )
   )
ON CONFLICT (timer_session_id, assignment_id) DO NOTHING;
