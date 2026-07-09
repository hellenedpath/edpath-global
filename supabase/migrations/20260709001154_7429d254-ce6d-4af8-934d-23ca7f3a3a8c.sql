ALTER TABLE public.institutions ADD COLUMN IF NOT EXISTS display_name TEXT;

UPDATE public.institutions SET display_name = name WHERE display_name IS NULL;

UPDATE public.institutions SET display_name = 'University of Ottawa / Université d''Ottawa' WHERE name = 'Université d''Ottawa University of Ottawa';
UPDATE public.institutions SET display_name = 'Algonquin College' WHERE name = 'The Algonquin College of Applied Learning and Technology';
UPDATE public.institutions SET display_name = 'Michener Institute for Applied Health Sciences' WHERE name = 'The Michener Institute for Applied Health Sciences';
UPDATE public.institutions SET display_name = 'Sheridan College' WHERE name = 'The Sheridan College Institute of Technology and Advanced Learning';
UPDATE public.institutions SET display_name = 'Canadore College' WHERE name = 'Canadore College of Applied Arts and Technology College Drive Campus North Bay ON';
UPDATE public.institutions SET display_name = 'Humber Polytechnic' WHERE name = 'Humber College Institute of Technology and Advanced Learning Humber Lakeshore Campus';
UPDATE public.institutions SET display_name = 'Cambrian College' WHERE name = 'Cambrian College of Applied Arts and Technology';
UPDATE public.institutions SET display_name = 'Confederation College' WHERE name = 'Confederation College of Applied Arts and Technology';
UPDATE public.institutions SET display_name = 'Durham College' WHERE name = 'Durham College of Applied Arts and Technology';
UPDATE public.institutions SET display_name = 'Loyalist College' WHERE name = 'Loyalist College of Applied Arts and Technology';
UPDATE public.institutions SET display_name = 'Mohawk College' WHERE name = 'Mohawk College of Applied Arts and Technology';
UPDATE public.institutions SET display_name = 'Seneca Polytechnic' WHERE name = 'Seneca College of Applied Arts and Technology';
UPDATE public.institutions SET display_name = 'University of Northern British Columbia' WHERE name = 'University of Northern British columbia';
UPDATE public.institutions SET display_name = 'University of Regina' WHERE name LIKE 'University of Regina%';