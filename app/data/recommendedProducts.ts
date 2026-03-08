export type RecommendedProduct = {
  name: string
  url: string
  imageUrl?: string
}

export const recommendedProducts: Record<string, RecommendedProduct[]> = {
  Gym: [
    {
      name: 'Amazon Basics Weights 2x2kg',
      url: 'https://www.amazon.nl/Amazon-Basics-IR92004-2X2kg-2-kg/dp/B078XXPC96/ref=sr_1_2?__mk_nl_NL=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2104RKIWRH5RZ&dib=eyJ2IjoiMSJ9.E3xN2iP4JBnFLAJ0by5zdv8-l5p-UY-n1H94dBJs1Y0zgU98RDDl6kl7uOyhJZgQaAWLbOSYK89QuN_E4BAQLPFkgqmocEUlpioDZAev9qE46EzmGKU8QKUMIKlFzvh6OS4Y_LCetgFcJlwp_90Mnk9-oZLLDRUXIQ3NLK5lxzumzMluFV4mr5ePtUnN8Vtj0vkWg0Ch-0zMDdxHXVzrvjC8GVlUkDRRmpmtaKgDVFDy0Wi2Da4xLjF2pt52NNqmNSiZWfcYAVfCzfEND_AcXdgQJ_Byc-aKpQveeO7WY1w.wilHCjBRrbGt3HYvKCpmy9qNhM30m1AjYVoUBhLqDfc&dib_tag=se&keywords=weights&qid=1772989276&sprefix=weight%2Caps%2C169&sr=8-2&th=1',
    },
  ],
  Alcohol: [
    {
      name: 'Coca-Cola Zero Cans',
      url: 'https://www.amazon.nl/Coca-Cola-Coke-Zero-Cans/dp/B086X52GJ1/ref=sr_1_1?__mk_nl_NL=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1G8EI5E8X85FR&dib=eyJ2IjoiMSJ9.46C-XHXQClvN3u9kuoTLVWxHjVUEdumoBLAsyCP4YOmCWw6aVyiezt3gIJNdUrKpMOvGaydugsYLwbK0F2fbqma3hH0WFH9RVwejzSX1y-vQYks5cH0qI5c3FMJhoPL0czOqHFCp59vFmlpqYnMVcx2I9TsNNufOcIIbbahTxw-qTtvqTeSHj-cYW6Y2UvhzyM38uQnjY6PqdEHRp8oaCzeCntAFrjbsD6G4Mh0t-30I3ZCnn7hDOLqDXiRx1UNA9SaZ2TYw7s3uvR9Yd9Y8FfQvsCxn4yKWQ0wUvN4urVo.3i3cHVHGC6LudwLG-zouSTduWATyWxVL-JpkjXw-8Po&dib_tag=se&keywords=coca+cola&qid=1772989352&sprefix=coca+cola%2Caps%2C182&sr=8-1',
    },
  ],
}
