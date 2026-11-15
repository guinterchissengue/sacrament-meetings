-- 10 reuniões de exemplo (>= 8 exigidas) com tipos, presidentes e oradores variados.
-- Dá 2 páginas na paginação (5 por página). "Smith" aparece em 3 reuniões
-- e "regular"/"testimony" em vários registos, para testar a pesquisa.
-- Os formatos JSON de hinos/oradores/ward_business têm de coincidir com os teus
-- tipos em lib/types.ts: ajusta as chaves se forem diferentes.
-- É seguro correr mais de uma vez: ON CONFLICT (date) DO NOTHING.
INSERT INTO meetings
  (date, meeting_type, presiding, conducting, announcements, opening_hymn,
   opening_prayer, ward_business, stake_business, sacrament_hymn, speakers,
   closing_hymn, closing_prayer)
VALUES
('2026-01-04', 'testimony', 'President David Carter', 'Aaron Reed',
 ARRAY['Fast Sunday: fast offerings can be given online', 'Young adult activity Friday at 7 PM'],
 '{"number":2,"title":"The Spirit of God"}', 'Sister Maria Costa',
 '[]', false,
 '{"number":169,"title":"As Now We Take the Sacrament"}',
 '[]',
 '{"number":136,"title":"I Know That My Redeemer Lives"}', 'Brother Paulo Tembe'),

('2026-01-11', 'regular', 'President David Carter', 'Aaron Reed',
 ARRAY['Institute classes resume Tuesday'],
 '{"number":85,"title":"How Firm a Foundation"}', 'Brother Daniel Smith',
 '[{"type":"sustain","name":"Sister Ana Mabunda","calling":"Relief Society Secretary"}]', false,
 '{"number":170,"title":"God, Our Father, Hear Us Pray"}',
 '[{"name":"Sister Emma Smith","topic":"Faith in Jesus Christ"},{"name":"Brother Lucas Johnson","topic":"Service"}]',
 '{"number":19,"title":"We Thank Thee, O God, for a Prophet"}', 'Sister Grace Okafor'),

('2026-01-18', 'regular', 'Brother Samuel Lee', 'Aaron Reed',
 ARRAY['Choir practice after the meeting'],
 '{"number":26,"title":"Praise to the Man"}', 'Brother Tiago Nhantumbo',
 '[]', false,
 '{"number":172,"title":"In Humility, Our Savior"}',
 '[{"name":"Sister Helena Garcia","topic":"Gratitude"},{"name":"Brother Marcos Brown","topic":"The Book of Mormon"}]',
 '{"number":98,"title":"I Need Thee Every Hour"}', 'Sister Emma Smith'),

('2026-01-25', 'special', 'President David Carter', 'Samuel Lee',
 ARRAY['Special musical program tonight'],
 '{"number":2,"title":"The Spirit of God"}', 'Sister Rita Johnson',
 '[{"type":"release","name":"Brother Marcos Brown","calling":"Activities Committee Chair"}]', false,
 '{"number":169,"title":"As Now We Take the Sacrament"}',
 '[{"name":"Brother Daniel Smith","topic":"Temples and family history"}]',
 '{"number":33,"title":"Now Let Us Rejoice"}', 'Brother Paulo Tembe'),

('2026-02-01', 'testimony', 'President David Carter', 'Aaron Reed',
 ARRAY['Fast Sunday: fast offerings can be given online'],
 '{"number":30,"title":"Come, Come, Ye Saints"}', 'Sister Helena Garcia',
 '[]', false,
 '{"number":170,"title":"God, Our Father, Hear Us Pray"}',
 '[]',
 '{"number":136,"title":"I Know That My Redeemer Lives"}', 'Brother Tiago Nhantumbo'),

('2026-02-08', 'regular', 'Brother Samuel Lee', 'Aaron Reed',
 ARRAY['Service project Saturday morning'],
 '{"number":85,"title":"How Firm a Foundation"}', 'Brother Lucas Johnson',
 '[]', false,
 '{"number":172,"title":"In Humility, Our Savior"}',
 '[{"name":"Sister Rita Johnson","topic":"Hope"},{"name":"Brother Paulo Tembe","topic":"Missionary work"}]',
 '{"number":237,"title":"Do What Is Right"}', 'Sister Ana Mabunda'),

('2026-02-15', 'stake', 'President Michael Torres', 'President David Carter',
 ARRAY['Stake leaders are visiting the branch today'],
 '{"number":2,"title":"The Spirit of God"}', 'Sister Grace Okafor',
 '[]', true,
 '{"number":169,"title":"As Now We Take the Sacrament"}',
 '[{"name":"President Michael Torres","topic":"Gathering Israel"},{"name":"Sister Emma Smith","topic":"Strengthening the rising generation"}]',
 '{"number":19,"title":"We Thank Thee, O God, for a Prophet"}', 'Brother Daniel Smith'),

('2026-02-22', 'regular', 'President David Carter', 'Samuel Lee',
 ARRAY['Family home evening ideas available in the foyer'],
 '{"number":30,"title":"Come, Come, Ye Saints"}', 'Brother Marcos Brown',
 '[{"type":"sustain","name":"Brother Tiago Nhantumbo","calling":"Elders Quorum President"}]', false,
 '{"number":170,"title":"God, Our Father, Hear Us Pray"}',
 '[{"name":"Brother Tiago Nhantumbo","topic":"Ministering"},{"name":"Sister Maria Costa","topic":"The Atonement"}]',
 '{"number":98,"title":"I Need Thee Every Hour"}', 'Sister Rita Johnson'),

('2026-03-01', 'general', 'President David Carter', 'Aaron Reed',
 ARRAY['General broadcast viewing follows sacrament meeting'],
 '{"number":26,"title":"Praise to the Man"}', 'Sister Maria Costa',
 '[]', false,
 '{"number":172,"title":"In Humility, Our Savior"}',
 '[{"name":"Brother Samuel Lee","topic":"Following the living prophet"}]',
 '{"number":33,"title":"Now Let Us Rejoice"}', 'Brother Lucas Johnson'),

('2026-11-15', 'regular', 'President David Carter', 'Aaron Reed',
 ARRAY['Thanksgiving dinner sign-up in the foyer'],
 '{"number":2,"title":"The Spirit of God"}', 'Sister Helena Garcia',
 '[]', false,
 '{"number":169,"title":"As Now We Take the Sacrament"}',
 '[{"name":"Sister Grace Okafor","topic":"Gratitude in all things"},{"name":"Brother Samuel Lee","topic":"Christlike service"}]',
 '{"number":136,"title":"I Know That My Redeemer Lives"}', 'Brother Paulo Tembe')
ON CONFLICT (date) DO NOTHING;
