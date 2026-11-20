/**
 * Termos que indicam menores de idade. Qualquer ocorrência em qualquer campo do
 * personagem bloqueia o cadastro. A lista é conservadora de propósito.
 */
export const MINOR_TERMS = [
  "criança", "crianca", "menor de idade", "pré-adolescente", "pre-adolescente", "adolescente",
  "colegial", "ensino médio", "ensino medio", "ensino fundamental", "novinha", "novinho",
  "garotinha", "garotinho", "menininha", "menininho", "bebê", "infantil", "loli", "lolita",
  "shota", "teen", "teenager", "underage", "minor", "child", "kid", "schoolgirl", "schoolboy",
  "high school", "middle school", "jailbait", "pedo",
];

/**
 * Nomes de pessoas reais conhecidas. É só a primeira barreira: o filtro de moderação
 * (etapa 5) e as denúncias completam. Adicione nomes aqui sempre que aparecerem.
 */
export const REAL_PEOPLE = [
  "anitta", "ivete sangalo", "xuxa", "bruna marquezine", "marina ruy barbosa", "paolla oliveira",
  "juliette", "gkay", "virginia fonseca", "neymar", "taylor swift", "ariana grande",
  "billie eilish", "selena gomez", "kim kardashian", "kylie jenner", "scarlett johansson",
  "margot robbie", "emma watson", "zendaya", "jennifer lopez", "shakira", "beyonce", "beyoncé",
  "rihanna", "dua lipa", "sydney sweeney", "megan fox", "angelina jolie", "gal gadot",
  "jenna ortega", "millie bobby brown", "olivia rodrigo", "sabrina carpenter", "doja cat",
  "nicki minaj", "cardi b", "lady gaga", "madonna", "britney spears", "elon musk",
];
