import YamlBookWrapper from '../../components/YamlBookWrapper';

/**
 * BonneAdventure book component
 *
 * Displays an interactive storybook about a brave butterfly named Bonne
 * who embarks on an adventure to help Princess Bowie.
 */
export default function BonneAdventure(): JSX.Element | null {
  return <YamlBookWrapper yamlFileName="bonne-adventure.yaml" />;
}
